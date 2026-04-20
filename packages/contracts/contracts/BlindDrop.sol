// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

contract BlindDrop is Permissioned {
    // Encrypted balances (euint64 to avoid overflow with standard ERC20/ETH decimals)
    mapping(address => euint64) private _encryptedBalances;
    
    // Multi-Item Management
    mapping(bytes32 => euint32) private itemInventory;
    mapping(bytes32 => euint64) private itemCurrentPrice;
    mapping(bytes32 => uint256) public lastDecayTimes;
    
    // Tokenomics & Logic
    uint256 public immutable SPAM_WALL_FEE = 0.01 ether;
    uint256 public constant DECAY_RATE = 10; // price decay per second

    // Initialize an item with stock and price
    function initializeItem(bytes32 itemId, uint32 initialStock, uint64 initialPrice) public {
        require(initialStock > 0, "Stock must be greater than zero");
        require(initialPrice > 0, "Price must be greater than zero");
        itemInventory[itemId] = FHE.asEuint32(initialStock);
        itemCurrentPrice[itemId] = FHE.asEuint64(initialPrice);
        lastDecayTimes[itemId] = block.timestamp;
    }

    // Task 1.1: Encrypted Balance Function
    function deposit() public payable {
        euint64 depositAmount = FHE.asEuint64(msg.value);
        _encryptedBalances[msg.sender] = FHE.add(_encryptedBalances[msg.sender], depositAmount);
    }

    // Task 1.2 & 1.3: Silent Fulfillment and Anti-Inference Pricing (Multi-Item Support)
    function attemptPurchase(bytes32 itemId, inEuint64 memory encryptedLimitOrder) public payable {
        // Spam Wall
        require(msg.value >= SPAM_WALL_FEE, "Spam wall: Must pay fixed fee");

        euint64 limitOrder = FHE.asEuint64(encryptedLimitOrder);
        euint32 stock = itemInventory[itemId];
        euint64 basePrice = itemCurrentPrice[itemId];
        
        // Conditions: Stock > 0, Balance >= BasePrice, LimitOrder >= BasePrice
        ebool hasStock = FHE.gt(stock, FHE.asEuint32(0));
        ebool hasBalance = FHE.gte(_encryptedBalances[msg.sender], basePrice);
        ebool meetsLimit = FHE.gte(limitOrder, basePrice);
        
        ebool canPurchase = FHE.and(hasStock, FHE.and(hasBalance, meetsLimit));

        // Subtract stock if condition met
        euint32 stockDecrement = FHE.select(canPurchase, FHE.asEuint32(1), FHE.asEuint32(0));
        itemInventory[itemId] = FHE.sub(stock, stockDecrement);

        // Subtract balance safely
        euint64 balanceDecrement = FHE.select(canPurchase, basePrice, FHE.asEuint64(0));
        _encryptedBalances[msg.sender] = FHE.sub(_encryptedBalances[msg.sender], balanceDecrement);

        // Task 1.3: Anti-Inference Pricing (Jitter)
        euint64 randomJitter = FHE.randomEuint64();
        // Use bitmask (127) for pseudo-modulo since `rem` is not available
        euint64 jitterAmount = FHE.add(FHE.and(randomJitter, FHE.asEuint64(127)), FHE.asEuint64(1));

        euint64 baseStep = FHE.asEuint64(1000); // fixed step
        euint64 priceIncrease = FHE.select(canPurchase, FHE.add(baseStep, jitterAmount), FHE.asEuint64(0));
        itemCurrentPrice[itemId] = FHE.add(basePrice, priceIncrease);
    }

    // Epic 2.2: Progressive Decay (Dutch Auction) - Multi-Item
    function decayPrice(bytes32 itemId) public {
        uint256 timePassed = block.timestamp - lastDecayTimes[itemId];
        require(timePassed > 0, "No time passed");

        uint64 decayValue = uint64(timePassed * DECAY_RATE);
        euint64 encryptedDecay = FHE.asEuint64(decayValue);

        euint64 currentPrice = itemCurrentPrice[itemId];

        // Safe sub
        ebool willUnderflow = FHE.lt(currentPrice, encryptedDecay);
        euint64 safeDecay = FHE.select(willUnderflow, currentPrice, encryptedDecay);
        itemCurrentPrice[itemId] = FHE.sub(currentPrice, safeDecay);

        lastDecayTimes[itemId] = block.timestamp;

        // Dynamic Reward
        uint256 reward = (address(this).balance * timePassed) / 10000;
        if (reward > 0 && address(this).balance >= reward) {
            payable(msg.sender).transfer(reward);
        }
    }

    // Epic 2.3: Stale Price Reveal (Delayed Oracle)
    mapping(bytes32 => uint64) public publicStalePrice;
    mapping(bytes32 => uint256) public itemLastRevealTime;

    function requestPriceReveal(bytes32 itemId) public {
        // In Fhenix, we use Permissioned decryption or Async callback.
        // We implement the keeper reward logic here.
        uint256 reward = 0.01 ether;
        if (address(this).balance >= reward) {
            payable(msg.sender).transfer(reward);
        }
    }

    // Returns the caller's balance sealed for their public key.
    // Must pass a valid permission signed by msg.sender.
    function getEncryptedBalance(Permission memory permission) public view onlySender(permission) returns (string memory) {
        return FHE.sealoutput(_encryptedBalances[msg.sender], permission.publicKey);
    }
}

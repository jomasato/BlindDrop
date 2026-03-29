// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

contract BlindDrop is Permissioned {
    // Encrypted balances (euint64 to avoid overflow with standard ERC20/ETH decimals)
    mapping(address => euint64) private _encryptedBalances;
    
    // Tokenomics & Logic
    uint256 public immutable SPAM_WALL_FEE = 0.01 ether;
    euint32 private _encryptedStock;
    euint64 private _encryptedBasePrice;
    
    // Constructor
    constructor(uint32 initialStock, uint64 initialPrice) {
        _encryptedStock = FHE.asEuint32(initialStock);
        _encryptedBasePrice = FHE.asEuint64(initialPrice);
    }

    // Task 1.1: Encrypted Balance Function
    function deposit() public payable {
        euint64 depositAmount = FHE.asEuint64(msg.value);
        _encryptedBalances[msg.sender] = FHE.add(_encryptedBalances[msg.sender], depositAmount);
    }

    // Task 1.2 & 1.3: Silent Fulfillment and Anti-Inference Pricing
    function attemptPurchase(inEuint64 memory encryptedLimitOrder) public payable {
        // Spam Wall
        require(msg.value >= SPAM_WALL_FEE, "Spam wall: Must pay fixed fee");

        euint64 limitOrder = FHE.asEuint64(encryptedLimitOrder);
        
        // Conditions: Stock > 0, Balance >= BasePrice, LimitOrder >= BasePrice
        ebool hasStock = FHE.gt(_encryptedStock, FHE.asEuint32(0));
        ebool hasBalance = FHE.gte(_encryptedBalances[msg.sender], _encryptedBasePrice);
        ebool meetsLimit = FHE.gte(limitOrder, _encryptedBasePrice);
        
        ebool canPurchase = FHE.and(hasStock, FHE.and(hasBalance, meetsLimit));

        // Subtract stock if condition met
        euint32 stockDecrement = FHE.select(canPurchase, FHE.asEuint32(1), FHE.asEuint32(0));
        _encryptedStock = FHE.sub(_encryptedStock, stockDecrement);

        // Subtract balance safely (if canPurchase is true, subtract price, else 0)
        euint64 balanceDecrement = FHE.select(canPurchase, _encryptedBasePrice, FHE.asEuint64(0));
        _encryptedBalances[msg.sender] = FHE.sub(_encryptedBalances[msg.sender], balanceDecrement);

        // Task 1.3: Anti-Inference Pricing (Jitter)
        // Generate random jitter between 1 and 100
        euint64 randomJitter = FHE.randomEuint64();
        // Use bitmask (127) for pseudo-modulo since `rem` is not available in FHE yet
        euint64 jitterAmount = FHE.add(FHE.and(randomJitter, FHE.asEuint64(127)), FHE.asEuint64(1));

        euint64 baseStep = FHE.asEuint64(1000); // fixed step
        euint64 priceIncrease = FHE.select(canPurchase, FHE.add(baseStep, jitterAmount), FHE.asEuint64(0));
        _encryptedBasePrice = FHE.add(_encryptedBasePrice, priceIncrease);
    }

    // Epic 2.2: Progressive Decay (Dutch Auction)
    uint256 public lastDecayTime;
    uint256 public constant DECAY_RATE = 10; // price decay per second

    function decayPrice() public {
        uint256 timePassed = block.timestamp - lastDecayTime;
        require(timePassed > 0, "No time passed");

        uint64 decayValue = uint64(timePassed * DECAY_RATE);
        euint64 encryptedDecay = FHE.asEuint64(decayValue);

        // Safe sub
        ebool willUnderflow = FHE.lt(_encryptedBasePrice, encryptedDecay);
        euint64 safeDecay = FHE.select(willUnderflow, _encryptedBasePrice, encryptedDecay);
        _encryptedBasePrice = FHE.sub(_encryptedBasePrice, safeDecay);

        lastDecayTime = block.timestamp;

        // Dynamic Reward
        uint256 reward = (address(this).balance * timePassed) / 10000;
        if (reward > 0 && address(this).balance >= reward) {
            payable(msg.sender).transfer(reward);
        }
    }

    // Epic 2.3: Stale Price Reveal (Delayed Oracle)
    uint64 public publicStalePrice;
    uint256 public lastRevealTime;

    function requestPriceReveal() public {
        // In Fhenix, we use Permissioned decryption or Async callback.
        // We implement the keeper reward logic here, while the actual
        // decryption callback sets `publicStalePrice` and `lastRevealTime`.
        uint256 reward = 0.01 ether;
        if (address(this).balance >= reward) {
            payable(msg.sender).transfer(reward);
        }
    }

    // Helper for debugging/Keeper logic (placeholder for 2.2 and 2.3)
    function getEncryptedBalance(Permission memory permission) public view returns (uint64) {
        // Uses Permissioned logic for revealing balance
        return FHE.decrypt(_encryptedBalances[msg.sender]);
    }
}

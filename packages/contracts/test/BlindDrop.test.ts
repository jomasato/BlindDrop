import { expect } from "chai";
import hre from "hardhat";
import { id as ethId, parseUnits, parseEther } from "ethers";

// FHE precompiles only exist on a Fhenix node (localfhenix/testnet).
// Tests that call FHE operations are skipped on the standard Hardhat network.
// Run `npx hardhat test --network localfhenix` for full coverage.

const IS_FHENIX = ["localfhenix", "testnet"].includes(hre.network.name);

describe("BlindDrop", function () {
    async function deploy() {
        const [owner, user1, keeper] = await hre.ethers.getSigners();
        const BlindDrop = await hre.ethers.getContractFactory("BlindDrop");
        const contract = await BlindDrop.deploy();
        await contract.waitForDeployment();
        return { contract, owner, user1, keeper };
    }

    const ITEM_ID = ethId("item-shadow-sniper");
    const INITIAL_STOCK = 100;
    const INITIAL_PRICE = parseUnits("50000", 0);

    // ----------------------------------------------------------------
    // Pure revert tests — no FHE, run on any network
    // ----------------------------------------------------------------

    describe("initializeItem — input validation", function () {
        it("should revert with zero stock", async function () {
            const { contract } = await deploy();
            await expect(
                contract.initializeItem(ITEM_ID, 0, INITIAL_PRICE)
            ).to.be.revertedWith("Stock must be greater than zero");
        });

        it("should revert with zero price", async function () {
            const { contract } = await deploy();
            await expect(
                contract.initializeItem(ITEM_ID, INITIAL_STOCK, 0)
            ).to.be.revertedWith("Price must be greater than zero");
        });
    });

    describe("attemptPurchase — spam wall", function () {
        it("should revert if spam wall fee is not paid", async function () {
            const { contract, user1 } = await deploy();
            if (IS_FHENIX) {
                await contract.initializeItem(ITEM_ID, INITIAL_STOCK, INITIAL_PRICE);
            }
            const mockEncrypted = { data: hre.ethers.toUtf8Bytes("mock"), securityZone: 0 };
            await expect(
                contract.connect(user1).attemptPurchase(ITEM_ID, mockEncrypted, {
                    value: parseEther("0.009"),
                })
            ).to.be.revertedWith("Spam wall: Must pay fixed fee");
        });
    });

    describe("SPAM_WALL_FEE", function () {
        it("should be 0.01 ETH", async function () {
            const { contract } = await deploy();
            expect(await contract.SPAM_WALL_FEE()).to.equal(parseEther("0.01"));
        });
    });

    // ----------------------------------------------------------------
    // FHE-dependent tests — require localfhenix or testnet
    // ----------------------------------------------------------------

    describe("initializeItem — success (FHE required)", function () {
        before(function () {
            if (!IS_FHENIX) this.skip();
        });

        it("should initialize successfully with valid params", async function () {
            const { contract } = await deploy();
            await contract.initializeItem(ITEM_ID, INITIAL_STOCK, INITIAL_PRICE);
            const lastDecay = await contract.lastDecayTimes(ITEM_ID);
            expect(lastDecay).to.be.gt(0);
        });
    });

    describe("deposit (FHE required)", function () {
        before(function () {
            if (!IS_FHENIX) this.skip();
        });

        it("should accept ETH deposits", async function () {
            const { contract, user1 } = await deploy();
            const depositAmount = parseEther("1.0");
            await contract.connect(user1).deposit({ value: depositAmount });
            const balance = await hre.ethers.provider.getBalance(
                await contract.getAddress()
            );
            expect(balance).to.equal(depositAmount);
        });
    });

    describe("attemptPurchase (FHE required)", function () {
        before(function () {
            if (!IS_FHENIX) this.skip();
        });

        it("should accept a purchase attempt with sufficient fee", async function () {
            const { contract, user1 } = await deploy();
            await contract.initializeItem(ITEM_ID, INITIAL_STOCK, INITIAL_PRICE);
            await contract.connect(user1).deposit({ value: parseEther("1.0") });
            const mockEncrypted = { data: hre.ethers.toUtf8Bytes("mock"), securityZone: 0 };
            await expect(
                contract.connect(user1).attemptPurchase(ITEM_ID, mockEncrypted, {
                    value: parseEther("0.01"),
                })
            ).to.not.be.reverted;
        });
    });

    describe("decayPrice (FHE required)", function () {
        before(function () {
            if (!IS_FHENIX) this.skip();
        });

        it("should revert if no time has passed (same block)", async function () {
            const { contract } = await deploy();
            await contract.initializeItem(ITEM_ID, INITIAL_STOCK, INITIAL_PRICE);
            await expect(contract.decayPrice(ITEM_ID)).to.be.revertedWith(
                "No time passed"
            );
        });

        it("should execute after time passes", async function () {
            const { contract, keeper } = await deploy();
            await contract.initializeItem(ITEM_ID, INITIAL_STOCK, INITIAL_PRICE);
            await hre.network.provider.send("evm_increaseTime", [10]);
            await hre.network.provider.send("evm_mine", []);
            await contract.deposit({ value: parseEther("1.0") });
            await expect(contract.connect(keeper).decayPrice(ITEM_ID)).to.not.be.reverted;
        });
    });

    describe("requestPriceReveal (FHE required)", function () {
        before(function () {
            if (!IS_FHENIX) this.skip();
        });

        it("should transfer reward if contract has sufficient balance", async function () {
            const { contract, keeper } = await deploy();
            await contract.deposit({ value: parseEther("0.1") });
            const keeperBefore = await hre.ethers.provider.getBalance(keeper.address);
            const tx = await contract.connect(keeper).requestPriceReveal(ITEM_ID);
            const receipt = await tx.wait();
            const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
            const keeperAfter = await hre.ethers.provider.getBalance(keeper.address);
            expect(keeperAfter + gasUsed).to.be.gt(keeperBefore);
        });

        it("should not revert if contract has no balance", async function () {
            const { contract, keeper } = await deploy();
            await expect(
                contract.connect(keeper).requestPriceReveal(ITEM_ID)
            ).to.not.be.reverted;
        });
    });
});

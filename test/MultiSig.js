const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("MultiSig", function () {

    async function deploySetup(){
        const [owner1, owner2, owner3, recipient] = await hre.ethers.getSigners();
        const threshold = 3;

        const MultiSig = await hre.ethers.getContractFactory("MultiSig");
        const multisig = await MultiSig.deploy([owner1.address, owner2.address, owner3.address], threshold);
        await multisig.deployed();

        return {multisig, owner1, owner2, owner3, recipient, threshold};

    }

    describe("Constructor", function () {
        it("Should set the right constructor parameters", async function () {
          const { multisig, owner1, owner2, owner3, threshold } = await loadFixture(deploySetup);
    
          expect(await threshold).to.equal(3);

          expect((await multisig.getOwners())[0]).to.equal(owner1.address);
          expect((await multisig.getOwners())[1]).to.equal(owner2.address);
          expect((await multisig.getOwners())[2]).to.equal(owner3.address);

        });
    })

})
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const lockedAmount = hre.ethers.utils.parseEther("1");

  const [owner1, owner2, owner3, recipient] = await hre.ethers.getSigners();
  const threshold = 3;

  const MultiSig = await hre.ethers.getContractFactory("MultiSig");
  const multisig = await MultiSig.deploy([owner1.address, owner2.address, owner3.address], threshold);

  await multisig.deployed();

  console.log("Contract deployed to",multisig.address);

  const owners = await multisig.getOwners();

  const transfer = await multisig.createTransfer(1, recipient.address);
  await transfer.wait();

  const tranfers1 = await multisig.getTransfers();
  console.log("Transfers1",tranfers1);

  const approver1 = await multisig.connect(owner1).approveTransfer(0);
  await approver1.wait();

  const approver2 = await multisig.connect(owner2).approveTransfer(0);
  await approver2.wait();

  const tranfers2 = await multisig.getTransfers();
  console.log("Transfers2",tranfers2);

  console.log("Owners",owners);

  // console.log(
  //   `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

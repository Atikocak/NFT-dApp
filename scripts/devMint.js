const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

async function devMint() {
  const contract = await ethers.getContract("MyBoredApe")
  const [owner] = await ethers.getSigners()
  const amountForDevs = await contract.amountForDevs()
  console.log("Minting started...")
  const mintTx = await contract.devMint(amountForDevs)
  const mintTxReceipt = await mintTx.wait(1)
  const balance = await contract.balanceOf(owner.address)
  if (balance == amountForDevs) {
    for (let i = 0; i < amountForDevs; i++) {
      console.log(
        `Minted tokenId ${mintTxReceipt.events[
          i
        ].args.tokenId.toString()} from contract: ${contract.address}`
      )
    }
  } else {
    console.log("Error on minting amount")
  }
  if (network.config.chainId == 31337) {
    // Moralis has a hard time if you move more than 1 block!
    await moveBlocks(2, (sleepAmount = 1000))
  }
}

devMint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

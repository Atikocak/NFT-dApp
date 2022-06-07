const { network } = require("hardhat")
const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")
const { whitelist } = require("../scripts/whitelist.json")
const { verify } = require("../utils/verify")
const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS
} = require("../helper-hardhat-config")

const baseUri = "ipfs://QmXZYx6jmchu5da85bipaMUXRrfTBurd6NrxYRt8Fj7LYe/"
const proxyRegistryAddressRinkeby = "0xf57b2c51ded3a29e6891aba85459d600256cf317"
const proxyRegistryAddressMainnet = "0xa5409ec958c83c3f309868babaca7c86dcb077c1"
const maxSupply = 100
const amountForDevs = 10

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  log("----------------------------------------------------")
  // Calculate merkle root from the whitelist array
  const leafNodes = whitelist.map((addr) => keccak256(addr))
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
  const root = merkleTree.getRoot()
  // Contract arguments
  const arguments = [
    baseUri,
    root,
    proxyRegistryAddressRinkeby,
    maxSupply,
    amountForDevs
  ]
  // Deploy the contract
  const myBoredApe = await deploy("MyBoredApe", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations
  })
  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...")
    await verify(myBoredApe.address, arguments)
  }
  log("----------------------------------------------------")
  console.log("contract successfully deployed to:", myBoredApe.address)
}

module.exports.tags = ["all", "myboredape"]

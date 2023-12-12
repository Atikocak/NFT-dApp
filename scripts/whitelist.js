const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")
const { whitelist } = require("./whitelist.json")
const { ethers } = require("hardhat")
// const address = require("../dapp.config").config.contractAddress

// Calculate merkle root from the whitelist array
const leafNodes = whitelist.map((addr) => keccak256(addr))
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
const root = merkleTree.getRoot()
// Push whitelist root data to the contract
async function PushWhitelistArray() {
  const Contract = await ethers.getContractFactory("MyBoredApe")
  const contract = await Contract.attach(address)
  console.log("Sending transaction please wait...")
  const result = await contract.setMerkleRoot(root)
  console.log("Transaction successful (tx): " + result.hash)
}

PushWhitelistArray()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

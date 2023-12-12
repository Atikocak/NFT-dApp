const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")
const { whitelist } = require("./whitelist.json")

// Calculate merkle root from the whitelist array
const leafNodes = whitelist.map((addr) => keccak256(addr))
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
const root = merkleTree.getRoot()

const baseUri = "ipfs://QmXZYx6jmchu5da85bipaMUXRrfTBurd6NrxYRt8Fj7LYe/"
const proxyRegistryAddressRinkeby = "0xf57b2c51ded3a29e6891aba85459d600256cf317"
const proxyRegistryAddressMainnet = "0xa5409ec958c83c3f309868babaca7c86dcb077c1"
const maxSupply = 100
const amountForDevs = 10

const arguments = [
    baseUri,
    root,
    proxyRegistryAddressRinkeby,
    maxSupply,
    amountForDevs
  ]

  module.exports = arguments
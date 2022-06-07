const contractAddresses = require("../minting_dapp/constants/networkMapping.json")
require("dotenv").config()
let chainId = process.env.chainId || 31337

const config = {
  title: "MyBoredApe Website",
  description: "An example NFT Project landing and minting dApp",
  contractAddress: contractAddresses[chainId]["MyBoredApe"][0],
  presaleMintLimit: 1,
  maxMintLimit: 2,
  price: 0.01,
  adminAddress: ""
}

module.exports = { config }

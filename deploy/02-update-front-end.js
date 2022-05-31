const { network, ethers } = require("hardhat")
const {
  frontEndContractsFile,
  frontEndAbiLocation
} = require("../helper-hardhat-config")
require("dotenv").config()
const fs = require("fs")

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Writing to front end...")
    await updateContractAddresses()
    await updateAbi()
    console.log("Front end written!")
  }
}

async function updateContractAddresses() {
  const chainId = network.config.chainId.toString()
  const myBoredApe = await ethers.getContract("MyBoredApe")
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, "utf8")
  )
  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]["MyBoredApe"].includes(myBoredApe.address)
    ) {
      contractAddresses[chainId]["MyBoredApe"].push(myBoredApe.address)
    }
  } else {
    contractAddresses[chainId] = { MyBoredApe: [myBoredApe.address] }
  }
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

async function updateAbi() {
  const myBoredApe = await ethers.getContract("MyBoredApe")
  fs.writeFileSync(
    `${frontEndAbiLocation}MyBoredApe.json`,
    myBoredApe.interface.format(ethers.utils.FormatTypes.json)
  )
}

module.exports.tags = ["all", "frontend"]

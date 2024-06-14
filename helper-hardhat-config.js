const networkConfig = {
  default: {
    name: "hardhat",
    keepersUpdateInterval: "30"
  },
  31337: {
    name: "localhost",
    subscriptionId: "588",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
    keepersUpdateInterval: "30",
    raffleEntranceFee: "100000000000000000", // 0.1 ETH
    callbackGasLimit: "500000" // 500,000 gas
  },
  4: {
    name: "rinkeby",
    subscriptionId: "588",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
    keepersUpdateInterval: "30",
    raffleEntranceFee: "100000000000000000", // 0.1 ETH
    callbackGasLimit: "500000" // 500,000 gas
  },
  1: {
    name: "mainnet",
    keepersUpdateInterval: "30"
  },
  84531: {
    name: "base_goerli",
    subscriptionId: "588",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
    keepersUpdateInterval: "30",
    raffleEntranceFee: "100000000000000000", // 0.1 ETH
    callbackGasLimit: "500000" // 500,000 gas
  }
}

const developmentChains = ["hardhat", "localhost"]
const ZkSyncChains = ["zkSyncMainnet", "hardhat"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const frontEndContractsFile = "../minting_dapp/constants/networkMapping.json"
const frontEndAbiLocation = "../minting_dapp/constants/"

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  frontEndContractsFile,
  frontEndAbiLocation
}

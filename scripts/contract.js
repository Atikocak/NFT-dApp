const web3 =  require("./web3.js");
const address = require("../dapp.config").config.contractAddress;
const { abi } = require("../artifacts/contracts/MyBoredApe.sol/MyBoredApe.json");

module.exports = new web3.eth.Contract(abi, address);
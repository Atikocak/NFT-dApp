const { createAlchemyWeb3 } = require("@alch/alchemy-web3")

const ALCHEMY_API_URL = process.env.RINKEBY_RPC_URL

const web3 = createAlchemyWeb3(ALCHEMY_API_URL)

module.exports = web3

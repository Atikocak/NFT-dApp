const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const web3 = createAlchemyWeb3("https://eth-rinkeby.alchemyapi.io/v2/EtBTRhY3YwIXxsAp1SFJZ8pBI3F5Y6xB");

module.exports = web3;
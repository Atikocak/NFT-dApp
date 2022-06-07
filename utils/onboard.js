import coinbaseModule from "@web3-onboard/coinbase"
import fortmaticModule from "@web3-onboard/fortmatic"
import injectedModule from "@web3-onboard/injected-wallets"
import ledgerModule from "@web3-onboard/ledger"
import { init } from "@web3-onboard/react"
import trezorModule from "@web3-onboard/trezor"
import walletConnectModule from "@web3-onboard/walletconnect"

const RPC_URL = process.env.PUBLIC_ALCHEMY_URL

const injected = injectedModule()
const ledger = ledgerModule()
const trezorOptions = {
  email: "test@test.com",
  appUrl: "https://www.blocknative.com"
}
const trezor = trezorModule(trezorOptions)
const walletConnect = walletConnectModule()
const coinbase = coinbaseModule()
const fortmatic = fortmaticModule({
  apiKey: process.env.PUBLIC_FORMATIC_KEY
})

export const initOnboard = init({
  wallets: [injected, ledger, trezor, walletConnect, coinbase, fortmatic],
  chains: [
    // {
    //   id: '0x1',
    //   token: 'ETH',
    //   label: 'Ethereum Mainnet',
    //   rpcUrl: 'https://mainnet.infura.io/v3/ababf9851fd845d0a167825f97eeb12b'
    // },
    // {
    //   id: '0x3',
    //   token: 'tROP',
    //   label: 'Ethereum Ropsten Testnet',
    //   rpcUrl: 'https://ropsten.infura.io/v3/ababf9851fd845d0a167825f97eeb12b'
    // },
    {
      id: "0x4",
      token: "rETH",
      label: "Ethereum Rinkeby Testnet",
      rpcUrl: String(RPC_URL)
    }
    // {
    //   id: '0x89',
    //   token: 'MATIC',
    //   label: 'Matic Mainnet',
    //   rpcUrl: 'https://matic-mainnet.chainstacklabs.com'
    // }
  ],
  appMetadata: {
    name: "MyBoredApe",
    icon: "",
    description: "Welcome to MyBoredApe team",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
      { name: "Coinbase", url: "https://wallet.coinbase.com/" }
    ]
  }
})

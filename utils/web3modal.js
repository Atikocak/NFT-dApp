import CoinbaseWalletSDK from "@coinbase/wallet-sdk"
import { Menu, Transition } from "@headlessui/react"
import { CogIcon } from "@heroicons/react/outline"
import { LogoutIcon } from "@heroicons/react/solid"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { ethers } from "ethers"
import Fortmatic from "fortmatic"
import { Fragment, useEffect, useState } from "react"
import Web3Modal from "web3modal"

const customNetworkOptions = {
  rpcUrl: "https://rpc-mainnet.maticvigil.com",
  chainId: 137
}

const INFURA_ID = process.env.INFURA_ID

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: INFURA_ID
    }
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "MyBoredApe dApp",
      infuraId: INFURA_ID,
      chainId: 4,
      darkMode: true
    }
  },
  fortmatic: {
    package: Fortmatic,
    options: {
      key: process.env.PUBLIC_FORTMATIC_KEY,
      network: customNetworkOptions
    }
  }
}

let web3Modal
let address

if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "rinkeby",
    cacheProvider: true,
    providerOptions,
    theme: "dark"
  })
}

export default function ConnectWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [hasMetamask, setHasMetamask] = useState(false)
  const [signer, setSigner] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState()

  const truncateAddress = (address) => {
    if (address) {
      return address.slice(0, 4) + "..." + address.slice(-4)
    } else {
      return ""
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true)
    }
  })

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const web3ModalProvider = await web3Modal.connect()
        setIsConnected(true)
        const provider = new ethers.providers.Web3Provider(web3ModalProvider)
        address = await provider.getSigner().getAddress()
        setSigner(address)
      } catch (error) {
        console.log("error: ", error)
        setErrorMessage(error)
      }
    } else {
      setIsConnected(false)
    }
  }

  async function disconnect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await web3Modal.clearCachedProvider()
        setIsConnected(false)
        setSigner(undefined)
      } catch (error) {
        console.log("error: ", error)
        setErrorMessage(error)
      }
    } else {
      setIsConnected(true)
    }
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
  }

  return (
    <div>
      {hasMetamask ? (
        isConnected ? (
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="ml-8 whitespace-nowrap inline-flex mb-1 px-4 py-2 items-center border border-transparent rounded-md shadow-md font-medium text-brand-background bg-white hover:bg-brand-violet transition-all duration-200">
                {truncateAddress(signer)}
                <CogIcon className="-mr-1 ml-2 h-6 w-6" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 w-56 rounded-md shadow-lg bg-brand-background ring-1 ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/mint"
                        className={classNames(
                          active
                            ? "bg-brand-light text-brand-background"
                            : "text-brand-light",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Mint Page
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="submit"
                        className={classNames(
                          active
                            ? "bg-brand-light text-brand-background"
                            : "text-brand-light",
                          "flex flex-row gap-2 items-center w-full text-left px-4 py-2 text-sm"
                        )}
                        onClick={() => disconnect()}
                      >
                        <LogoutIcon className="h-4 w-4" aria-hidden="true" />
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <button
            className="ml-8 whitespace-nowrap inline-flex mb-1 px-4 py-2 items-center border border-transparent rounded-md shadow-md font-medium text-brand-background bg-white hover:bg-brand-violet transition-all duration-200"
            onClick={() => connect()}
          >
            Connect
          </button>
        )
      ) : (
        <span className="ml-8 whitespace-nowrap inline-flex mb-1 px-4 py-2 items-center border border-transparent rounded-md shadow-md font-medium text-brand-background bg-white hover:bg-brand-violet transition-all duration-200">
          Please install metamask
        </span>
      )}
    </div>
  )
}

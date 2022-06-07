import CoinbaseWalletSDK from "@coinbase/wallet-sdk"
import { Menu, Transition } from "@headlessui/react"
import { CogIcon } from "@heroicons/react/outline"
import { LogoutIcon } from "@heroicons/react/solid"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { ethers } from "ethers"
import Fortmatic from "fortmatic"
import Link from "next/link"
import { Fragment, forwardRef, useEffect, useState } from "react"
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

  const MyLink = forwardRef((props, ref) => {
    let { href, children, ...rest } = props
    return (
      <Link href={href}>
        <a ref={ref} {...rest}>
          {children}
        </a>
      </Link>
    )
  })

  return (
    <div>
      {hasMetamask ? (
        isConnected ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button
              as="button"
              className="inline-flex items-center px-4 py-2 mb-1 ml-8 font-medium transition-all duration-200 bg-white border border-transparent rounded-md shadow-md whitespace-nowrap text-brand-background hover:bg-brand-violet"
            >
              {truncateAddress(signer)}
              <CogIcon className="w-6 h-6 ml-2 -mr-1" aria-hidden="false" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 w-56 origin-top-right rounded-md shadow-lg bg-brand-background ring-1 ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    <MyLink
                      href="/mint"
                      className="flex flex-row items-center w-full gap-2 px-4 py-2 text-sm text-left transition-all duration-200 text-brand-light hover:bg-brand-light hover:text-brand-background"
                    >
                      Mint Page
                    </MyLink>
                  </Menu.Item>
                  <Menu.Item>
                    <button
                      type="submit"
                      className="flex flex-row items-center w-full gap-2 px-4 py-2 text-sm text-left transition-all duration-200 text-brand-light hover:bg-brand-light hover:text-brand-background"
                      onClick={() => disconnect()}
                    >
                      <LogoutIcon className="w-5 h-5" aria-hidden="true" />
                      Sign Out
                    </button>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <button
            className="inline-flex items-center px-4 py-2 mb-1 ml-8 font-medium transition-all duration-200 bg-white border border-transparent rounded-md shadow-md whitespace-nowrap text-brand-background hover:bg-brand-violet"
            onClick={() => connect()}
          >
            Connect
          </button>
        )
      ) : (
        <span className="inline-flex items-center px-4 py-2 mb-1 ml-8 font-medium transition-all duration-200 bg-white border border-transparent rounded-md shadow-md whitespace-nowrap text-brand-background hover:bg-brand-violet">
          Please install metamask
        </span>
      )}
    </div>
  )
}

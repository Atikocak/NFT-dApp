import {
  useConnectWallet,
  useSetChain,
  useWallets
} from '@web3-onboard/react';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { config } from '../dapp.config';
import {
  getMaxSupply, getTotalMinted, isPaused, isPreSaleStarted, isPublicSaleStarted, presaleMint,
  publicMint
} from '../utils/interact';
import { initOnboard } from '../utils/onboard';

export default function Mint(props) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()

  const [maxSupply, setMaxSupply] = useState(props.maxSupply)
  const [totalMinted, setTotalMinted] = useState(props.totalMinted)
  const [maxMintAmount, setMaxMintAmount] = useState(0)
  const [paused, setPaused] = useState(props.paused)
  const [isPublicSale, setIsPublicSale] = useState(props.isPublicSale)
  const [isPreSale, setIsPreSale] = useState(props.isPreSale)

  const [status, setStatus] = useState(null)
  const [mintAmount, setMintAmount] = useState(1)
  const [isMinting, setIsMinting] = useState(false)
  const [onboard, setOnboard] = useState(null)

  useEffect(() => {
    setOnboard(initOnboard)
  }, [])

  useEffect(() => {
    if(!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    )
    window.localStorage.setItem(
      "connectedWallets",
      JSON.stringify(connectedWalletsLabelArray)
    )
  }, [connectedWallets, wallet])

  useEffect(() => {
    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem("connectedWallets")
    );
    if(previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        await connect({
          autoSelect: {
            label: previouslyConnectedWallets[0],
            disableModals: true
          }
        });
      }
      setWalletFromLocalStorage();
    };
  }, [onboard, connect])

  useEffect(() => {
    const init = async () => {
      setMaxSupply(await getMaxSupply());
      setTotalMinted(await getTotalMinted());

      setPaused(await isPaused());
      setIsPublicSale(await isPublicSaleStarted());
      const isPreSale = await isPreSaleStarted();
      setIsPreSale(isPreSale);

      setMaxMintAmount(
        isPreSale ? config.presaleMintLimit : config.maxMintLimit
      );
    }

    init();
  }, [])

  const incrementMintAmount = () => {
    if (mintAmount < maxMintAmount) {
      setMintAmount(mintAmount + 1)
    };
  }

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1)
    };
  }

  const presaleMintHandler = async () => {
    setStatus(false);
    setIsMinting(true);

    const { success, status } = await presaleMint(mintAmount);

    setStatus({
      success,
      message: status
    });

    setIsMinting(false);
    Router.replace("/mint");
  }
  const publicMintHandler = async () => {
    setStatus(false);
    setIsMinting(true);

    const { success, status } = await publicMint(mintAmount);

    setStatus({
      success,
      message: status
    });

    setIsMinting(false);
    Router.replace("/mint");
  }

  return (
    <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background relative -z-50">
      <img
          src="/images/dark-minimalist-blur.jpg"
          className="animate-pulse-slow absolute inset-auto block w-full min-h-screen object-cover -z-40"
      />
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
          <div className="md:max-w-3xl w-full bg-gray-900/90 border-2 border-violet-900 shadow-xl filter backdrop-blur-sm py-4 rounded-md px-2 md:px-10 flex flex-col items-center">
            {wallet && (
              <button
              className="absolute right-14 bg-indigo-600 hover:bg-white hover:text-indigo-600 transition duration-200 ease-in-out font-open_sans border-2 border-[rgba(0,0,0,1)] shadow-[0px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none px-4 py-2 rounded-md text-sm text-white tracking-wide uppercase"
              onClick={() => disconnect({
                label: wallet.label
              })}
            >
              Disconnect
            </button>
            )}
            <h1 className="font-varela uppercase font-bold text-3xl md:text-4xl bg-gradient-to-br from-brand-mint to-brand-violet bg-clip-text text-transparent mt-3">
              {paused ? 'Paused' : isPreSale ? 'Pre-Sale' : isPublicSale ? 'Public Sale' : 'Sale Not Started'}
            </h1>
            <h3 className="text-sm text-pink-200 tracking-widest">
              {wallet?.accounts[0]?.address 
                ? wallet?.accounts[0]?.address.slice(0, 4) + 
                "..." + 
                wallet?.accounts[0]?.address.slice(-4)
                : ""}
            </h3>

            <div className="flex flex-col md:flex-row md:space-x-14 w-full mt-10 md:mt-14">
              <div className="relative w-full">
                <div className="font-varela absolute top-1 left-1 opacity-75 filter backdrop-blur-lg text-base px-4 py-1 bg-black border border-brand-purple rounded-md flex items-center justify-center text-white font-semibold">
                  <p>
                    <span className="text-brand-pink">{totalMinted}</span> /{' '}
                    {maxSupply}
                  </p>
                </div>

                <img
                  src="/images/myboredape.png"
                  className="object-cover w-full sm:h-[280px] md:w-[250px] rounded-md"
                />
              </div>

              <div className="flex flex-col items-center w-full px-4 mt-16 md:mt-0">
                <div className="font-varela flex items-center justify-between w-full">
                  <button
                    className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-gray-300 font-bold rounded-md"
                    onClick={decrementMintAmount}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 12H6"
                      />
                    </svg>
                  </button>
                  <p className="flex items-center justify-center flex-1 grow text-center font-bold text-brand-pink text-3xl md:text-4xl">
                    {mintAmount}
                  </p>
                  <button
                    className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-gray-300 font-bold rounded-md"
                    onClick={incrementMintAmount}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>

                <p className="text-sm text-pink-200 tracking-widest mt-3">
                  Max Mint Amount: {maxMintAmount}
                </p>

                <div className="border-t border-b py-4 mt-16 w-full">
                  <div className="w-full text-xl font-varela flex items-center justify-between text-brand-yellow">
                    <p>Total</p>

                    <div className="flex items-center space-x-3">
                      <p>
                        {Number.parseFloat(config.price * mintAmount).toFixed(
                          2
                        )}
                      </p>
                      <svg width="24px" height="24px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 17.97 4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0 4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                      </svg>
                      ETH
                      <span className="text-gray-400">+ GAS</span>
                    </div>
                  </div>
                </div>

                {/* Mint Button && Connect Wallet Button */}
                {wallet ? (
                  <button
                    className={` ${
                      paused || isMinting || (!isPublicSale && !isPreSale)
                        ? 'bg-gray-900 cursor-not-allowed'
                        : 'bg-gradient-to-br from-brand-violet to-brand-light shadow-lg hover:shadow-pink-400/50'
                    } font-coiny mt-12 w-full px-6 py-3 rounded-md text-2xl text-white  mx-4 tracking-wide uppercase`}
                    disabled={paused || isMinting || (!isPublicSale && !isPreSale)}
                    onClick={isPreSale ? presaleMintHandler : publicMintHandler}
                  >
                    {isMinting ? 'Minting...' : 'Mint'}
                  </button>
                ) : (
                  <button
                    className="font-mono mt-12 w-full bg-gradient-to-br from-brand-violet to-brand-light shadow-lg px-6 py-3 rounded-md text-2xl text-violet-700 hover:shadow-violet-400/30 mx-4 tracking-wide uppercase"
                    onClick={() => connect()}
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>

            {/* Status */}
            {status && (
            <div
              className={`border ${
                status.success ? 'border-green-500' : 'border-red-500'
              } rounded-md text-start h-full px-4 py-4 w-full mx-auto mt-8 md:mt-4"`}
            >
              <p className={`${
                status.success ? 'text-green-500' : 'text-red-500'
              } flex flex-col space-y-2 text-sm md:text-base break-words ...`}>
                {status.message}
              </p>
            </div>
            )}

            {/* Contract Address */}
            <div className="border-t border-gray-800 flex flex-col items-center mt-10 py-2 w-full">
              <h3 className="font-varela text-2xl text-brand-pink uppercase mt-6">
                Contract Address
              </h3>
              <a
                href={`https://rinkeby.etherscan.io/address/${config.contractAddress}#readContract`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 mt-4"
              >
                <span className="break-all ...">{config.contractAddress}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const paused = await isPaused();
  const isPublicSale = await isPublicSaleStarted();
  const isPreSale = await isPreSaleStarted();
  const totalMinted = await getTotalMinted();
  const maxSupply = await getMaxSupply();
  return { props: { paused, isPublicSale, isPreSale, totalMinted, maxSupply } };
}
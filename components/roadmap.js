import { useEffect, useState } from "react"

export default function Roadmap() {
  const [clientWindowHeight, setClientWindowHeight] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setClientWindowHeight(window.scrollY)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div id="roadmap" className="w-full px-5 py-6 scroll-mt-16 bg-brand-mint">
      <div className="container max-w-3xl mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-semibold text-brand-silk text-shadow drop-shadow-sm">
            ROADMAP
          </h1>
          <span className="mb-2 text-slate-700 drop-shadow-sm">
            Work in progress - we're adding more to this soon.
          </span>
        </div>
        <div className="relative border-l-8 border-solid border-slate-300 drop-shadow px-3 py-10 w-[90%] md:w-1/2 clear-both left-8 md:left-1/2">
          <div
            className={`${
              clientWindowHeight > 250 && clientWindowHeight < 1600
                ? "md:-left-[0px]"
                : "md:left-[200px]"
            } relative transition-all delay-200 duration-500 border-4 border-solid rounded-xl border-slate-600 shadow-sm shadow-black rotate-2 px-5 py-8 bg-brand-silk ml-[9px] after:-left-[46px] md:after:-left-[47px] after:absolute after:w-8 after:h-8 after:rounded-full after:z-10 after:top-4 after:bg-brand-background after:border-2 after:border-brand-light after:drop-shadow-sm`}
          >
            <span className="absolute -top-10 -right-5 bg-[#3cbb49] px-5 py-2 border-4 border-solid rounded-2xl border-[#83d068] shadow-sm shadow-black rotate-12 text-white text-shadow animate-wiggle">
              DONE
            </span>
            <h2 className="text-xl font-semibold text-brand-hard drop-shadow-sm">
              RARITY LISTINGS & VERIFICATION
            </h2>
            <p className="mt-2 text-justify drop-shadow-sm">
              After drop we will list MyBoredApe on the major rarity sites like
              Rarity Tools. We will also start the process on becoming Verified
              on OpenSea.
            </p>
          </div>
        </div>
        <div className="relative left-8 md:left-[8px] border-l-8 md:border-l-0 md:border-r-8 border-solid border-slate-300 drop-shadow px-3 py-10 w-[90%] md:w-1/2 clear-both md:right-1/2">
          <img
            className="hidden md:block max-w-[90%] absolute -top-[135px]"
            src="/images/roadmap_pixel.png"
          />
          <div
            className={`${
              clientWindowHeight > 500 && clientWindowHeight < 2200
                ? "md:-left-[0px]"
                : "md:-left-[200px]"
            } relative transition-all delay-200 duration-500 border-4 border-solid rounded-xl border-slate-600 shadow-sm shadow-black -rotate-2 px-5 py-8 bg-brand-silk ml-[9px] md:ml-0 md:mr-[9px] after:-left-[37px] md:after:left-[357px] after:absolute after:w-8 after:h-8 after:rounded-full after:z-10 after:top-4 after:bg-brand-background after:border-2 after:border-brand-light after:drop-shadow-sm`}
          >
            <img
              className="md:invisible max-w-[60%] max-h-[20%] md:max-w-[0%] md:max-h-[0%]"
              src="/images/roadmap_pixel.png"
            />
            <span className="absolute -top-10 -right-5 bg-[#ffb93c] px-5 py-2 border-4 border-solid rounded-2xl border-[#f9df5f] shadow-sm shadow-black rotate-12 text-white text-shadow animate-wiggle">
              IN PROGRESS
            </span>
            <h2 className="text-xl font-semibold text-brand-hard drop-shadow-sm">
              PIXELAPES
            </h2>
            <p className="mt-2 text-justify drop-shadow-sm">
              These pixel art NFTs will be free for all MyBoredApe holders (just
              pay gas). You will be able to mint one per MyBoredApe that you
              own. We will also work on a partnership with Arcade.inc to bring
              these PIXELAPES into their metaverse. After that, we will open
              this collection up to other minters - plus, as a holder you'll be
              able to earn from this. Every MyBoredApe holder will be able to
              refer between 3 and 5 people to mint a PIXELAPES, and earn 50% on
              the mint price. There will be limitations to this (total supply
              and possibly a time window), but it's an opportunity for holders
              to earn.
            </p>
          </div>
        </div>
        <div className="relative left-8 border-l-8 border-solid border-slate-300 drop-shadow px-3 py-10 w-[90%] md:w-1/2 clear-both md:left-1/2">
          <img
            className="hidden md:block max-w-[90%] max-h-[50%] absolute left-16 -top-[130px]"
            src="/images/roadmap_workshop.png"
          />
          <div
            className={`${
              clientWindowHeight > 1150 && clientWindowHeight < 2600
                ? "md:-left-[0px]"
                : "md:left-[200px]"
            } relative transition-all delay-200 duration-500 border-4 border-solid rounded-xl border-slate-600 shadow-sm shadow-black rotate-2 px-5 py-8 bg-brand-silk ml-[9px] after:-left-[50px] md:after:-left-[49px] after:absolute after:w-8 after:h-8 after:rounded-full after:z-10 after:top-4 after:bg-brand-background after:border-2 after:border-brand-light after:drop-shadow-sm`}
          >
            <img
              className="md:invisible max-w-[25%] max-h-[10%] md:max-w-[0%] md:max-h-[0%]"
              src="/images/roadmap_workshop.png"
            />
            <span className="absolute -top-10 -right-5 bg-[#ffb93c] px-5 py-2 border-4 border-solid rounded-2xl border-[#f9df5f] shadow-sm shadow-black rotate-12 text-white text-shadow animate-wiggle">
              IN PROGRESS
            </span>
            <h2 className="text-xl font-semibold text-brand-hard drop-shadow-sm">
              MYBORED APE WORKSHOP
            </h2>
            <p className="mt-2 text-justify drop-shadow-sm">
              We will develop a workshop that allows you to mix and match traits
              from the bears you are currently holding (plus some other traits)
              and mint a Mutant Ape version for free - just pay for gas. You
              will be able to mint one Mutant Ape NFT per MyBoredApe NFT that
              you hold in your wallet.
            </p>
          </div>
        </div>
        <div className="relative left-8 md:left-[8px] border-l-8 md:border-l-0 md:border-r-8 border-solid border-slate-300 drop-shadow px-3 py-10 w-[90%] md:w-1/2 clear-both md:right-1/2">
          <img
            className="hidden md:block max-w-[90%] max-h-[50%] absolute -left-10 -top-[90px]"
            src="/images/roadmap_loot.png"
          />
          <div
            className={`${
              clientWindowHeight > 1450 && clientWindowHeight < 2900
                ? "md:-left-[0px]"
                : "md:-left-[200px]"
            } relative transition-all delay-200 duration-500 border-4 border-solid rounded-xl border-slate-600 shadow-sm shadow-black -rotate-2 px-5 py-8 bg-brand-silk ml-[9px] md:ml-0 md:mr-[9px] after:-left-[39px] md:after:left-[352px] after:absolute after:w-8 after:h-8 after:rounded-full after:z-10 after:top-4 after:bg-brand-background after:border-2 after:border-brand-light after:drop-shadow-sm`}
          >
            <img
              className="md:invisible max-w-[70%] max-h-[40%] md:max-w-[0%] md:max-h-[0%]"
              src="/images/roadmap_loot.png"
            />
            <span className="absolute -top-10 -right-5 bg-[#ffb93c] px-5 py-2 border-4 border-solid rounded-2xl border-[#f9df5f] shadow-sm shadow-black rotate-12 text-white text-shadow animate-wiggle">
              IN PROGRESS
            </span>
            <h2 className="text-xl font-semibold text-brand-hard drop-shadow-sm">
              LOOT BOX
            </h2>
            <p className="mt-2 text-justify drop-shadow-sm">
              We will create a snapshot and allow all holders to claim one or
              more loot boxes filled with ETH prizes, discount deals, whitelist
              spots for other projects and even some NFTs.
            </p>
          </div>
        </div>
        <div className="relative left-8 border-l-8 border-solid border-slate-300 drop-shadow px-3 py-10 w-[90%] md:w-1/2 clear-both md:left-1/2">
          <img
            className="hidden md:block max-w-[90%] max-h-[50%] absolute left-10 -top-[120px]"
            src="/images/roadmap_staking.png"
          />
          <div
            className={`${
              clientWindowHeight > 1780 && clientWindowHeight < 3250
                ? "md:-left-[0px]"
                : "md:left-[200px]"
            } relative transition-all delay-200 duration-500 border-4 border-solid rounded-xl border-slate-600 shadow-sm shadow-black rotate-2 px-5 py-8 bg-brand-silk ml-[9px] after:-left-[50px] md:after:-left-[48px] after:absolute after:w-8 after:h-8 after:rounded-full after:z-10 after:top-4 after:bg-brand-background after:border-2 after:border-brand-light after:drop-shadow-sm`}
          >
            <img
              className="md:invisible max-w-[40%] max-h-[50%] md:max-w-[0%] md:max-h-[0%]"
              src="/images/roadmap_staking.png"
            />
            <span className="absolute -top-10 -right-5 bg-[#ffb93c] px-5 py-2 border-4 border-solid rounded-2xl border-[#f9df5f] shadow-sm shadow-black rotate-12 text-white text-shadow animate-wiggle">
              IN PROGRESS
            </span>
            <h2 className="text-xl font-semibold text-brand-hard drop-shadow-sm">
              STAKING + TOKEN EARNING
            </h2>
            <p className="mt-2 text-justify drop-shadow-sm">
              We have plans to create a staking system that allows you to earn
              an ERC20 token. It will be possible to stake your NFTs from the
              main collection or the other two collections. Details will follow,
              and keep in mind that this is a long-term project.
            </p>
          </div>
        </div>
        <div className="box-border px-5 py-3 mt-4 text-center font-coiny">
          <a
            href="https://www.instagram.com/p/CUGFNNDpSji/?utm_source=ig_embed&utm_campaign=loading"
            target="_blank"
            className="inline-block px-2 py-1 text-2xl transition-all scale-100 border-2 border-solid rounded-md shadow-md cursor-pointer bg-brand-violet drop-shadow-sm text-brand-silk border-brand-silk hover:bg-brand-silk hover:scale-110 hover:text-brand-violet hover:border-brand-violet hover:-rotate-2 hover:ease-in-out"
          >
            Roadmap 2.0
          </a>
        </div>
      </div>
    </div>
  )
}

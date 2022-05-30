export default function FAQ() {
  return (
    <div 
      id="faq"
      className="scroll-mt-16 py-6 w-full bg-brand-light">
      <div className="container mx-auto max-w-3xl">
        <div className="mt-2 mb-8 text-center">
          <h1 className="text-4xl text-brand-mint text-shadow font-semibold drop-shadow-sm">FREQUENTLY ASKED QUESTIONS</h1>
        </div>
        <div className="text-left ">
          <ul>
            <li className="mb-6">
              <h2 className="mb-1 text-2xl text-brand-hard font-semibold drop-shadow">What are NFTs?</h2>
              <p className="mb-1 text-base text-brand-violet drop-shadow">A non-fungible token (NFT) is a non-interchangeable unit of data stored on a blockchain, a form of digital ledger, that can be sold and traded.</p>
              <p className="mb-1 text-base text-brand-violet drop-shadow">NFTs may be associated with digital files such as photos, videos, and audio. Because each token is uniquely identifiable, NFTs differ from blockchain cryptocurrencies, such as Bitcoin.</p>
            </li>
            <li className="mb-6">
              <h2 className="mb-1 text-2xl text-brand-hard font-semibold drop-shadow">What is Ethereum?</h2>
              <p className="mb-1 text-base text-brand-violet drop-shadow">Ethereum is the community-run technology powering the cryptocurrency ether (ETH) and thousands of decentralized applications. Learn more on <a className="underline text-brand-hard hover:text-brand-mint" href="https://ethereum.org/" target="_blank">ethereum.org</a>
              </p>
            </li>
            <li className="mb-6">
              <h2 className="mb-1 text-2xl text-brand-hard font-semibold drop-shadow">What wallets are supported?</h2>
              <p className="mb-1 text-base text-brand-violet drop-shadow">We recommend using Metamask, which can be downloaded from the <a className="underline text-brand-hard hover:text-brand-mint" href="https://metamask.io/download/" target="_blank">Metamask website</a>. We support both the browser plugin and the mobile apps.</p>
              <p className="mb-1 text-base text-brand-violet drop-shadow">We also integrate with Wallet Connect, which supports a number of wallets. The full list can be found on the <a className="underline text-brand-hard hover:text-brand-mint" href="https://walletconnect.com/registry?type=wallet" target="_blank">Wallet Connect website</a>.</p>
            </li>
            <li className="mb-6">
              <h2 className="mb-1 text-2xl text-brand-hard font-semibold drop-shadow">Where does my nft go after i purchase a MyBored Ape?</h2>
              <p className="mb-1 text-base text-brand-violet drop-shadow">Your wallet will own the NFT. You will be able to see the contents of your wallet on your OpenSea profile, and some wallets display your NFTs as well.</p>
            </li>
            <li className="mb-6">
              <h2 className="mb-1 text-2xl text-brand-hard font-semibold drop-shadow">Sounds awesome - How do i get involved?</h2>
              <p className="mb-1 text-base text-brand-violet drop-shadow">A great place to start is our Discord, home to a very large and very active community of MyBored Ape enthusiasts. You don't need to be a MyBored Ape holder to join us there! All are welcome to jump into the conversation, let us know your ideas, and hang out with many others who like the bears!</p>
            </li>
            <li className="mb-6">
              <h2 className="mb-1 text-2xl text-brand-hard font-semibold drop-shadow">Are MyBored Apes a good investment?</h2>
              <p className="mb-1 text-base text-brand-violet drop-shadow">The success of the project depends on many factors. We do not have a crystal ball so it is impossible to know how it will go, but we strongly believe in our project and think it has a bright future ahead, but ultimately you will have to decide for yourself.</p>
              <p className="mb-1 text-base text-brand-violet drop-shadow">Only spend money if you can afford it!</p>
            </li>
            <li className="mb-6">
              <h2 className="mb-1 text-2xl text-brand-hard font-semibold drop-shadow">Where did MyBored Apes come from?</h2>
              <p className="mb-1 text-base text-brand-violet drop-shadow">Our team comes from a mobile game development background, and we have a number of hit games under their belt. We are partnering on this project with Memo Angeles who is a great artist.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
export default function About() {
  return (
    <div id="about" className="w-full px-5 py-6 scroll-mt-16 bg-brand-violet">
      <div className="container max-w-3xl mx-auto">
        <h1 className="py-5 text-5xl font-semibold text-center text-brand-silk text-shadow">
          ABOUT
        </h1>
        <div className="grid items-center w-full grid-cols-2 gap-6 px-2 py-10 justify-items-end">
          <div className="">
            <img className="object-cover w-1/2 ml-6" src="/images/about.png" />
            <span className="relative px-2 py-1 text-3xl font-extrabold border-2 rounded-md shadow-2xl drop-shadow-lg text-brand-background bottom-1 bg-brand-silk shadow-black border-brand-background">
              MyBored Ape
            </span>
          </div>
          <div className="">
            <p className="mt-5 text-justify text-brand-light drop-shadow-sm">
              MyBoredApe is a collection of 100 NFTS on the Ethereum blockchain.
              The project is developed by Happy Games, previously a indie game
              studio with several hits to their name, who are making the switch
              to web3. Check us out below.
            </p>

            <p className="mt-5 text-justify text-brand-light drop-shadow-sm">
              This website designed as an example for any NFT Project. There is
              no any official relationship between this website and Bored Ape
              Yatch Club project. This is a simple UI/UX example which does not
              have any complex components. Also, there are Minting and Admin
              dashboard pages integrated with web3 hooks to interact with smart
              contracts by using this website as a dApp. All of the components
              used here are handmade and created from scratch.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

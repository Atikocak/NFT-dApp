export default function About() {
  return (
    <div 
      id="about"
      className="scroll-mt-16 py-6 w-full bg-brand-violet">
      <div className="container mx-auto max-w-3xl">
        <div className="grid grid-cols-2 gap-6 px-2 py-10 justify-items-end items-center w-full">
          <div className="">
            <img 
              className="ml-6 w-1/2 object-cover"
              src="/images/about.png" />
            <span className="font-extrabold text-3xl drop-shadow-lg text-brand-background relative bottom-1 px-2 py-1 bg-brand-silk rounded-md shadow-2xl shadow-black border-2 border-brand-background">MyBored Ape</span>
          </div>
          <div className="">
            <h1 className="font-semibold text-5xl text-brand-silk text-shadow text-center">ABOUT</h1>
            <p className="mt-5 text-brand-light drop-shadow-sm text-justify">MyBoredApe is a collection of 100 NFTS on the Ethereum blockchain. The project is developed by Happy Games, previously a indie game studio with several hits to their name, who are making the switch to web3. Check us out below.</p>
            
            <p className="mt-5 text-brand-light drop-shadow-sm text-justify">This website designed as an example for any NFT Project. There is no any official relationship between this website and Bored Ape Yatch Club project. This is a simple UI/UX example which does not have any complex components. Also, there are Minting and Admin dashboard pages integrated with web3 hooks to interact with smart contracts by using this website as a dApp. All of the components used here are handmade and created from scratch.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
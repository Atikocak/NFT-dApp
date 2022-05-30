export default function Info() {
  return (
    <div className="py-2 w-full bg-brand-light">
      <div className="container mx-auto max-w-3xl">
        <div className="grid grid-cols-2 gap-6 px-2 py-10 justify-items-end items-center w-full">
          <div className="text-center">
            <h1 className="font-open_sans font-semibold text-4xl text-violet-700 drop-shadow text-shadow">100 Bored Apes</h1>
            <p className="mt-6 text-base text-justify text-gray-900 drop-shadow">
              MyBoredApe is a collection of 100 thoughtfully designed and randomly generated NFTs on the Ethereum Blockchain by Mexican artist Memo Angeles. MyBoredApe holders can participate in exclusive events, such as: NFT claims, raffles, giveaways and much, much more. Don't forget, all MyBoredApe are special -- but some are especially special.
  
              ... and the best is yet to come, check out our roadmap below. 
            </p>
          </div>
          <div className="">
            <img 
              className="w-64 h-64 rounded-md object-cover"
              src="/images/myboredape.png" />
          </div>
        </div>
      </div>
    </div>
  )
}
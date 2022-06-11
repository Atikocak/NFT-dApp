const Moralis = require("moralis/node")
require("dotenv").config()
const contractAddresses = require("./constants/networkMapping.json")
let chainId = process.env.chainId || 31337
let moralisChainId = chainId == "31337" ? "1337" : chainId
const contractAddress = contractAddresses[chainId]["MyBoredApe"][0]

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL
const appId = process.env.NEXT_PUBLIC_MORALIS_DAPP_ID
const masterKey = process.env.masterKey

async function main() {
  await Moralis.start({ serverUrl, appId, masterKey })
  console.log(`Working with contract address ${contractAddress}`)

  let MintedOptions = {
    // Moralis understands a local chain is 1337
    description: "MyBoredApe Event Watcher",
    chainId: moralisChainId,
    address: contractAddress,
    topic: "Transfer(address,address,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "Transfer",
      type: "event"
    },
    tableName: "Minted",
    sync_historical: true
  }

  // let devMintOptions = {
  //   chainId: moralisChainId,
  //   address: contractAddress,
  //   topic: "DevMint(uint64)",
  //   abi: {
  //     inputs: [
  //       {
  //         internalType: "uint64",
  //         name: "_quantity",
  //         type: "uint64"
  //       }
  //     ],
  //     name: "devMint",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function"
  //   },
  //   tableName: "DevMint",
  //   sync_historical: true
  // }

  // let preSaleMintOptions = {
  //   chainId: moralisChainId,
  //   address: contractAddress,
  //   topic: "PreSaleMint(uint64, bytes32[])",
  //   abi: {
  //     inputs: [
  //       {
  //         internalType: "uint64",
  //         name: "_quantity",
  //         type: "uint64"
  //       },
  //       {
  //         internalType: "bytes32[]",
  //         name: "_proof",
  //         type: "bytes32[]"
  //       }
  //     ],
  //     name: "preSaleMint",
  //     outputs: [],
  //     stateMutability: "payable",
  //     type: "function"
  //   },
  //   tableName: "PreSaleMint",
  //   sync_historical: true
  // }

  // let publicSaleMintOptions = {
  //   chainId: moralisChainId,
  //   address: contractAddress,
  //   topic: "PublicSaleMint(uint64, uint256)",
  //   abi: {
  //     inputs: [
  //       {
  //         internalType: "uint64",
  //         name: "_quantity",
  //         type: "uint64"
  //       },
  //       {
  //         internalType: "uint256",
  //         name: "callerPublicSaleKey",
  //         type: "uint256"
  //       }
  //     ],
  //     name: "publicSaleMint",
  //     outputs: [],
  //     stateMutability: "payable",
  //     type: "function"
  //   },
  //   tableName: "PublicSaleMint",
  //   sync_historical: true
  // }

  const mintedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    MintedOptions,
    { useMasterKey: true }
  )
  // const devMintResponse = await Moralis.Cloud.run(
  //   "watchContractEvent",
  //   devMintOptions,
  //   { useMasterKey: true }
  // )
  // const preSaleMintResponse = await Moralis.Cloud.run(
  //   "watchContractEvent",
  //   preSaleMintOptions,
  //   { useMasterKey: true }
  // )
  // const publicSaleMintResponse = await Moralis.Cloud.run(
  //   "watchContractEvent",
  //   publicSaleMintOptions,
  //   { useMasterKey: true }
  // )
  if (
    mintedResponse.success
    // &&
    // devMintResponse.success &&
    // preSaleMintResponse.success &&
    // publicSaleMintResponse.success
  ) {
    console.log("Success! Database updated with watching events")
  } else {
    console.log("Something went wrong...")
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

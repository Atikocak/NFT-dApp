require("@nomiclabs/hardhat-etherscan");
const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { whitelist } = require("./whitelist.json");
const { config } = require("../dapp.config");

const baseUri = "ipfs://QmXXVTnHmQ57erbksutXRZ7YpArVjr2rSPK3Rf5uHLxzB5/";
const proxyRegistryAddressRinkeby = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
const proxyRegistryAddressMainnet = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
const maxSupply = 100;
const amountForDevs = 10;

async function main() {
  // Calculate merkle root from the whitelist array
  const leafNodes = whitelist.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
  const root = merkleTree.getRoot();

  await hre.run("verify:verify", {
    address: config.contractAddress,
    constructorArguments: [
      baseUri, root, proxyRegistryAddressRinkeby, maxSupply, amountForDevs
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

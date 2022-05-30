const { expect } = require("chai");
const assert = require("chai").assert;
const { ethers, waffle } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const web3 = require("web3");

const uri = "ipfs://QmXXVTnHmQ57erbksutXRZ7YpArVjr2rSPK3Rf5uHLxzB5/";
const proxyAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
const maxSupply = 100;
const amountForDevs = 10;

let contract;
let account = [];
let leafNodes;
let merkleTree;
let root;
let auctionSaleStartTime;
let auctionSaleAmountLimit;
let preSaleAmountPerAddress;
let maxAmountPerAddress;
let allowlistPrice;
let publicPrice;
let publicSaleStartTime;
let saleConfig;
let block;
let blockNumber;
let currentTimestampInSeconds;
let newTimestampInSeconds;

beforeEach(async () => {
  currentTimestampInSeconds = Date.now() / 1000 | 0;
  auctionSaleStartTime = currentTimestampInSeconds + 60;
  auctionSaleAmountLimit = 30;
  preSaleAmountPerAddress = 1;
  maxAmountPerAddress = 2;
  allowlistPrice = web3.utils.toWei("0.2", "ether");
  publicPrice = web3.utils.toWei("0.3", "ether");
  publicSaleStartTime = auctionSaleStartTime + 600;
  const [owner, addr1] = await ethers.getSigners();
  account.push(owner.address, addr1.address);
  leafNodes = account.map((addr) => keccak256(addr));
  merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
  root = merkleTree.getRoot();
  const MyBoredApe = await ethers.getContractFactory("MyBoredApe");
  contract = await MyBoredApe.deploy(
    uri, root, proxyAddress, maxSupply, amountForDevs
  );
  await contract.deployed();
  blockNumber = ethers.provider.getBlockNumber();
  block = await ethers.provider.getBlock(blockNumber);
})

describe("MyBoredApe NFT Contract Testing", () => {
  describe("Deployment", () => {
    it("deploys the contract", () => {
      assert.ok(contract.address);
    })
  })
  describe("Owner Functions", () => {
    it("set metadata URI", async () => {
      const uri = "ipfs://QmeRhuiG3FmGHmLABHWm5nwcwckMKdZQB7o9NQiHeHhU97/";
      const newURI = await contract.setBaseURI(uri);
      assert.ok(newURI);
    })
    it("allowlist deployable", async () => { 
      const [owner, addr1, addr2, addr3] = await ethers.getSigners();
      const leaf  = keccak256(addr3.address);
      const proof = merkleTree.getHexProof(leaf);
      const isValid = merkleTree.verify(proof, leaf, root);
      expect(isValid).to.equal(false);
    })
    it("all operations except owner functions are pausable", async () => {
      await contract.togglePause();
      var isPaused = await contract.paused();
      expect(isPaused).to.equal(true);
      await contract.togglePause();
      isPaused = await contract.paused();
      expect(isPaused).to.equal(false);
    })
    it("set auction sale config", async () => {
      await contract.setSaleConfig(auctionSaleStartTime, auctionSaleAmountLimit, preSaleAmountPerAddress, maxAmountPerAddress);
      saleConfig = await contract.saleConfig();
      expect(saleConfig.preSaleAmountPerAddress).to.equal(1);
    })
    it("set non auction sale config", async () => {
      await contract.endAuctionAndSetNonAuctionSaleInfo(allowlistPrice, publicPrice, publicSaleStartTime);
      saleConfig = await contract.saleConfig();
      expect(saleConfig.publicPrice).to.equal(web3.utils.toWei("0.3", "ether"));
    })
    it("allowlist can be changed", async () => {
      const [owner, addr1, addr2, addr3] = await ethers.getSigners();
      account = [];
      account.push(owner.address, addr1.address, addr2.address, addr3.address);
      leafNodes = account.map((addr) => keccak256(addr));
      merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
      root = merkleTree.getRoot();
      await contract.setMerkleRoot(root);
      const leaf  = keccak256(addr3.address);
      const proof = merkleTree.getHexProof(leaf);
      const isValid = merkleTree.verify(proof, leaf, root);
      expect(isValid).to.equal(true);
    })
    it("max supply can be decreased", async () => {
      const maxSupply = await contract.maxSupply();
      const newSupply = maxSupply - 1;
      await contract.setMaxSupply(newSupply);
      expect(newSupply <= maxSupply).to.be.true;
    })
    it("owner can batch mint", async () => {
      const [owner] = await ethers.getSigners();
      const amountForDevs = await contract.amountForDevs();
      await contract.devMint(amountForDevs);
      const ownerBalance = await contract.balanceOf(owner.address);
      expect(amountForDevs).to.equal(ownerBalance);
    })
    it("owner can batch burn", async () => {
      const [owner, addr1] = await ethers.getSigners();
      const amountForDevs = await contract.amountForDevs();
      await contract.devMint(amountForDevs);
      const tokenList = await contract.getTokenBalance(owner.address);
      await contract.burn(tokenList[0], tokenList[tokenList.length - 1]);
      const balance = await contract.balanceOf(owner.address);
      expect(balance).to.equal(0);
    })
    it("only owner can withdraw money", async () => {
      await contract.setSaleConfig(auctionSaleStartTime, auctionSaleAmountLimit, preSaleAmountPerAddress, maxAmountPerAddress);
      await contract.endAuctionAndSetNonAuctionSaleInfo(allowlistPrice, publicPrice, publicSaleStartTime);
      const [owner, addr1, addr2, addr3] = await ethers.getSigners();
      const leaf  = keccak256(addr1.address);
      const proof = merkleTree.getHexProof(leaf);
      await contract.connect(addr1).preSaleMint(1, proof, {value: allowlistPrice});
      const balance = await contract.balanceOf(addr1.address);
      expect(balance).to.equal(1);
      var contractBalance = await ethers.provider.getBalance(contract.address);
      contractBalance = web3.utils.fromWei(contractBalance.toString());
      expect(contractBalance).to.equal("0.2");
      await contract.withdraw();
      contractBalance = await ethers.provider.getBalance(contract.address);
      contractBalance = web3.utils.fromWei(contractBalance.toString());
      expect(contractBalance).to.equal("0");
    })
  })
  describe("Public Functions", () => {
    it("auction mint", async () => {
      await contract.setSaleConfig(auctionSaleStartTime, auctionSaleAmountLimit, preSaleAmountPerAddress, maxAmountPerAddress);
      if (block.timestamp >= auctionSaleStartTime) {
        newTimestampInSeconds = block.timestamp + 5;
      } else {
        newTimestampInSeconds = auctionSaleStartTime + 5;
      }
      await ethers.provider.send("evm_mine", [newTimestampInSeconds]);
      const [owner, addr1, addr2, addr3] = await ethers.getSigners();
      const price = await contract.getAuctionPrice(currentTimestampInSeconds);
      await contract.auctionMint(1, {value: price});
      const balance = await contract.balanceOf(owner.address);
      expect(balance).to.equal(1);
    })
    it("presale mint", async () => {
      auctionSaleStartTime = block.timestamp + 1;
      await contract.setSaleConfig(auctionSaleStartTime, auctionSaleAmountLimit, preSaleAmountPerAddress, maxAmountPerAddress);
      await contract.endAuctionAndSetNonAuctionSaleInfo(allowlistPrice, publicPrice, publicSaleStartTime);
      if (block.timestamp >= publicSaleStartTime) {
        newTimestampInSeconds = block.timestamp + 5;
      } else {
        newTimestampInSeconds = publicSaleStartTime + 5;
      }
      await ethers.provider.send("evm_mine", [newTimestampInSeconds]);
      const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
      const leaf  = keccak256(addr3.address);
      const proof = merkleTree.getHexProof(leaf);
      await contract.connect(addr3).preSaleMint(1, proof, {value: web3.utils.toWei("0.5", "ether")});
      const balance = await contract.balanceOf(addr3.address);
      expect(balance).to.equal(1);
      var contractBalance = await ethers.provider.getBalance(contract.address);
      contractBalance = web3.utils.fromWei(contractBalance.toString());
      expect(contractBalance).to.equal("0.2");
    })
    it("public mint", async () => {
      auctionSaleStartTime = block.timestamp + 1;
      await contract.setSaleConfig(auctionSaleStartTime, auctionSaleAmountLimit, preSaleAmountPerAddress, maxAmountPerAddress);
      await contract.endAuctionAndSetNonAuctionSaleInfo(allowlistPrice, publicPrice, publicSaleStartTime);
      if (block.timestamp >= publicSaleStartTime) {
        newTimestampInSeconds = block.timestamp + 5;
      } else {
        newTimestampInSeconds = publicSaleStartTime + 5;
      }
      await ethers.provider.send("evm_mine", [newTimestampInSeconds]);
      const publicSaleKey = 100;
      await contract.setPublicSaleKey(publicSaleKey);
      const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
      const quantity = 2;
      const totalCost = publicPrice * quantity;
      await contract.connect(addr4).publicSaleMint(quantity, publicSaleKey, {value: totalCost.toString()});
      expect(await contract.totalSupply()).to.equal(quantity);
    })
  })
})
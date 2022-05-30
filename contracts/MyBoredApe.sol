/*
     __  ___      ____                      __   ___
    /  |/  /_  __/ __ )____  ________  ____/ /  /   |  ____  ___
   / /|_/ / / / / __  / __ \/ ___/ _ \/ __  /  / /| | / __ \/ _ \
  / /  / / /_/ / /_/ / /_/ / /  /  __/ /_/ /  / ___ |/ /_/ /  __/
 /_/  /_/\__, /_____/\____/_/   \___/\__,_/  /_/  |_/ .___/\___/
        /____/                                     /_/
*/

// @created for Fiverr
// @author atibaba.eth

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ERC721Psi.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyBoredApe is Pausable, ERC721Psi, Ownable, ReentrancyGuard {
  using Strings for uint256;

  // Sale configuration at once
  struct SaleConfig {
    uint32 auctionSaleStartTime;
    uint32 publicSaleStartTime;
    uint64 allowlistPrice;
    uint64 publicPrice;
    uint256 publicSaleKey;
    uint32 auctionSaleAmountLimit;
    uint32 preSaleAmountPerAddress;
    uint32 maxAmountPerAddress;
  }

  // Starting variables
  SaleConfig public saleConfig;
  address proxyRegistryAddress;
  uint256 public maxSupply;
  uint32 public immutable amountForDevs;
  bytes32 public root;
  string private _baseTokenURI;
  mapping(address => uint256) public _amountMinted;

  // Not changable variables for constructor
  constructor(
    string memory _uri,
    bytes32 _merkleroot,
    address _proxyRegistryAddress,
    uint32 _maxSupply,
    uint32 _amountForDevs
  ) ERC721Psi("MyBoredApe", "APE") {
    require(
      _amountForDevs <= _maxSupply,
      "Low collection size or high dev amount"
    );
    setBaseURI(_uri);
    root = _merkleroot;
    proxyRegistryAddress = _proxyRegistryAddress;
    maxSupply = _maxSupply;
    amountForDevs = _amountForDevs;
  }

  // Prevent smart contract calls to this contract
  modifier onlyUser() {
    require(msg.sender == tx.origin, "The caller is another contract");
    _;
  }

  // Check caller allowlisted or not
  modifier isValidMerkleProof(bytes32[] calldata _proof) {
    require(
      MerkleProof.verify(
        _proof,
        root,
        keccak256(abi.encodePacked(msg.sender))
      ) == true,
      "You are not allowed to mint"
    );
    _;
  }

  // Metadata URI
  function setBaseURI(string memory baseURI_) public onlyOwner {
    _baseTokenURI = baseURI_;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }

  // Pause contract operations for everyone except the owner
  function togglePause() external onlyOwner {
    if (!paused()) {
      _pause();
    } else {
      _unpause();
    }
  }

  // Refund if payment is greater than necessary
  function refundIfOver(uint256 _price) private {
    if (msg.value > _price) {
      payable(msg.sender).transfer(msg.value - _price);
    }
  }

  // Set initial sale parameters
  function setSaleConfig(
    uint32 _auctionSaleStartTime,
    uint32 _auctionSaleAmountLimit,
    uint32 _preSaleAmountPerAddress,
    uint32 _maxAmountPerAddress
  ) external onlyOwner {
    require(
      _auctionSaleStartTime != 0 && _auctionSaleStartTime >= block.timestamp,
      "Invalid entry for auction start time"
    );
    require(
      _auctionSaleAmountLimit <= maxSupply - amountForDevs,
      "There is not enough supply to cover that amount for auction"
    );
    require(
      _maxAmountPerAddress >= _preSaleAmountPerAddress,
      "Max limit should be greater or equal to the presale limit"
    );
    saleConfig.auctionSaleStartTime = _auctionSaleStartTime;
    saleConfig.auctionSaleAmountLimit = _auctionSaleAmountLimit;
    saleConfig.preSaleAmountPerAddress = _preSaleAmountPerAddress;
    saleConfig.maxAmountPerAddress = _maxAmountPerAddress;
  }

  // Auction price calculation
  uint64 public constant AUCTION_START_PRICE = 0.5 ether;
  uint64 public constant AUCTION_END_PRICE = 0.1 ether;
  uint64 public constant AUCTION_PRICE_CURVE_LENGTH = 240 minutes;
  uint64 public constant AUCTION_DROP_INTERVAL = 10 minutes;
  uint64 public constant AUCTION_DROP_PER_STEP =
    (AUCTION_START_PRICE - AUCTION_END_PRICE) /
      (AUCTION_PRICE_CURVE_LENGTH / AUCTION_DROP_INTERVAL);

  function getAuctionPrice(uint64 _saleStartTime) public view returns (uint64) {
    if (block.timestamp < _saleStartTime) {
      return AUCTION_START_PRICE;
    }
    if (block.timestamp - _saleStartTime >= AUCTION_PRICE_CURVE_LENGTH) {
      return AUCTION_END_PRICE;
    } else {
      uint64 steps = uint64(block.timestamp - _saleStartTime) /
        AUCTION_DROP_INTERVAL;
      return AUCTION_START_PRICE - (steps * AUCTION_DROP_PER_STEP);
    }
  }

  // Auction Mint
  function auctionMint(uint64 _quantity)
    external
    payable
    onlyUser
    whenNotPaused
  {
    uint64 _saleStartTime = uint64(saleConfig.auctionSaleStartTime);
    require(
      _saleStartTime != 0 && block.timestamp >= _saleStartTime,
      "Auction has not started yet"
    );
    require(_quantity > 0, "Amount should be greater than zero");
    require(
      totalSupply() + amountForDevs + _quantity <=
        saleConfig.auctionSaleAmountLimit,
      "Reserved amount exceeded for auction"
    );
    require(
      _amountMinted[msg.sender] + _quantity <=
        saleConfig.preSaleAmountPerAddress,
      "Not allowed to mint that amount"
    );
    uint64 totalCost = getAuctionPrice(_saleStartTime) * _quantity;
    require(msg.value >= totalCost, "Payment is lower than necessary");
    _safeMint(msg.sender, _quantity);
    _amountMinted[msg.sender] += _quantity;
    refundIfOver(totalCost);
  }

  // End auction and set non auction sale configuration
  function endAuctionAndSetNonAuctionSaleInfo(
    uint64 _allowlistPrice,
    uint64 _publicPrice,
    uint32 _publicSaleStartTime
  ) external onlyOwner {
    saleConfig.allowlistPrice = _allowlistPrice;
    saleConfig.publicPrice = _publicPrice;
    saleConfig.publicSaleStartTime = _publicSaleStartTime;
  }

  // Prevent automated scripting directed to contract
  function setPublicSaleKey(uint256 _key) external onlyOwner {
    saleConfig.publicSaleKey = _key;
  }

  // Deploy allowlisted addresses
  function setMerkleRoot(bytes32 _merkleroot) external onlyOwner {
    root = _merkleroot;
  }

  // Allowlist Mint
  function preSaleMint(uint64 _quantity, bytes32[] calldata _proof)
    external
    payable
    isValidMerkleProof(_proof)
    onlyUser
    whenNotPaused
  {
    uint64 price = uint64(saleConfig.allowlistPrice);
    require(price != 0, "Presale has not started yet");
    require(_quantity > 0, "Amount should be greater than zero");
    require(
      _quantity <= saleConfig.preSaleAmountPerAddress,
      "Requested amount is higher than allowed"
    );
    require(
      _amountMinted[msg.sender] + _quantity <=
        saleConfig.preSaleAmountPerAddress,
      "You already minted some before, please reconsider the amount you request"
    );
    require(
      totalSupply() + amountForDevs + _quantity <= maxSupply,
      "Exceeded max supply"
    );
    uint64 totalCost = price * _quantity;
    require(msg.value >= totalCost, "Payment is lower than necessary");
    _safeMint(msg.sender, _quantity);
    _amountMinted[msg.sender] += _quantity;
    refundIfOver(totalCost);
  }

  // Public sale check
  function isPublicSaleOn(
    uint64 _publicPriceWei,
    uint256 _publicSaleKey,
    uint32 _publicSaleStartTime
  ) public view returns (bool) {
    return
      _publicPriceWei != 0 &&
      _publicSaleKey != 0 &&
      _publicSaleStartTime <= block.timestamp;
  }

  // Public Mint
  function publicSaleMint(uint64 _quantity, uint256 callerPublicSaleKey)
    external
    payable
    onlyUser
    whenNotPaused
  {
    uint64 price = uint64(saleConfig.publicPrice);
    require(
      saleConfig.publicSaleKey == callerPublicSaleKey,
      "Incorrect public sale key"
    );
    require(
      isPublicSaleOn(
        saleConfig.publicPrice,
        saleConfig.publicSaleKey,
        saleConfig.publicSaleStartTime
      ),
      "Publicsale has not started yet"
    );
    require(_quantity > 0, "Amount should be greater than zero");
    require(
      _amountMinted[msg.sender] + _quantity <= saleConfig.maxAmountPerAddress,
      "Not allowed to mint that amount"
    );
    require(
      totalSupply() + amountForDevs + _quantity <= maxSupply,
      "Exceeded max supply"
    );
    uint64 totalCost = price * _quantity;
    require(msg.value >= totalCost, "Payment is lower than necessary");
    _safeMint(msg.sender, _quantity);
    _amountMinted[msg.sender] += _quantity;
    refundIfOver(totalCost);
  }

  // Burn tokens belong to contract owner
  function burn(uint256 firstTokenId, uint256 lastTokenId) external onlyOwner {
    for (uint256 tokenId = firstTokenId; tokenId <= lastTokenId; tokenId++) {
      if (_isApprovedOrOwner(msg.sender, tokenId)) {
        _burn(tokenId);
      }
    }
  }

  // Decrease max supply and burn unminted amount
  function setMaxSupply(uint256 _maxSupply) external onlyOwner {
    require(
      _maxSupply > totalSupply() && _maxSupply <= maxSupply,
      "Amount should be greater than current supply and lower than max supply"
    );
    maxSupply = _maxSupply;
  }

  // Dev Mint
  function devMint(uint64 _quantity) external onlyOwner {
    require(
      totalSupply() + _quantity <= amountForDevs,
      "Exceeded reserved amount"
    );
    _safeMint(msg.sender, _quantity);
  }

  // Token ownership data by given tokenId
  function getOwnershipData(uint256 _tokenId) external view returns (address) {
    return ownerOf(_tokenId);
  }

  // Token balance data by address
  function getTokenBalance(address _owner)
    external
    view
    returns (uint256[] memory)
  {
    uint256 balance = balanceOf(_owner);
    uint256[] memory tokenList = new uint256[](balance);
    if (balance > 0) {
      for (uint256 i; i < balance; i++) {
        tokenList[i] = tokenOfOwnerByIndex(_owner, i);
      }
      return tokenList;
    }
    revert("Owner has no balance");
  }

  // Withdraw Balance
  function withdraw() external onlyOwner nonReentrant {
    (bool success, ) = msg.sender.call{value: address(this).balance}("");
    require(success, "Transfer failed.");
  }

  /**
   * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
   */
  function isApprovedForAll(address owner, address operator)
    public
    view
    override
    returns (bool)
  {
    // Whitelist OpenSea proxy contract for easy trading.
    ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
    if (address(proxyRegistry.proxies(owner)) == operator) {
      return true;
    }

    return super.isApprovedForAll(owner, operator);
  }
}

/**
  @title An OpenSea delegate proxy contract which we include for whitelisting.
  @author OpenSea
*/
contract OwnableDelegateProxy {

}

/**
  @title An OpenSea proxy registry contract which we include for whitelisting.
  @author OpenSea
*/
contract ProxyRegistry {
  mapping(address => OwnableDelegateProxy) public proxies;
}

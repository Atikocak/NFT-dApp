const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { whitelist } = require("../scripts/whitelist.json");
import { config } from "../dapp.config";
const contract = require("../scripts/contract");
const web3 = require("../scripts/web3");

// Calculate merkle root from the whitelist array
const leafNodes = whitelist.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
const root = merkleTree.getRoot();

export const getTotalMinted = async () => {
    const totalMinted = await contract.methods.totalSupply().call();
    return totalMinted;
}

export const getMaxSupply = async () => {
    const maxSupply = await contract.methods.maxSupply().call();
    return maxSupply;
}

export const isPaused = async () => {
    const isPaused = await contract.methods.paused().call();
    return isPaused;
}

export const isPublicSaleStarted = async () => {
    const { 
        publicSaleStartTime, publicPrice, publicSaleKey 
    } = await contract.methods.saleConfig().call();
    const isPublicSaleStarted = await contract.methods.isPublicSaleOn(publicPrice, publicSaleKey, publicSaleStartTime).call();
    return isPublicSaleStarted;
}

export const isPreSaleStarted = async () => {
    const { publicSaleStartTime } = await contract.methods.saleConfig().call();
    const currentTimestampInSeconds = Date.now() / 1000 | 0;
    if (publicSaleStartTime > 0 && currentTimestampInSeconds < publicSaleStartTime) {
        return true;
    }
    return false;
}

export const presaleMint = async (mintAmount) => {
    const account = window.ethereum.selectedAddress;

    if(!account) {
        return {
            success: false,
            status: "To be able to mint, you need to connect your wallet"
        }
    }
    const leaf = keccak256(account);
    const proof = merkleTree.getHexProof(leaf);

    // Verify Merkle Proof
    const isValid = merkleTree.verify(proof, leaf, root);

    if(!isValid) {
        return {
            success: false,
            status: "You are not on the whitelist"
        }
    }

    const nonce = await web3.eth.getTransactionCount(
        account, "latest"
    )

    // Setup Ethereum Transaction
    const tx = {
        from: account,
        to: config.contractAddress,
        value: parseInt(
            web3.utils.toWei(String(config.price * mintAmount), "ether")
        ).toString(16), // hex value
        gas: String(300000 * mintAmount),
        data: contract.methods.presaleMint(account, mintAmount, proof).encodeABI(),
        nonce: nonce.toString(16) // hex value
    }

    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [tx]
        });
        return {
            success: true,
            status: (
                <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
                    <p>Check out your transaction on Etherscan:</p>
                    <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
                </a>
            )
        }
    } catch (error) {
        return {
            success: false,
            status: "Error: " + error.message
        }
    }
}

export const publicMint = async (mintAmount) => {
    const account = window.ethereum.selectedAddress;

    if(!account) {
        return {
            success: false,
            status: "To be able to mint, you need to connect your wallet"
        }
    }
    const leaf = keccak256(account);
    const proof = merkleTree.getHexProof(leaf);

    // Setup Ethereum Transaction
    const tx = {
        from: account,
        to: config.contractAddress,
        value: parseInt(
            web3.utils.toWei(String(config.price * mintAmount), "ether")
        ).toString(16), // hex value
        gas: String(300000 * mintAmount),
        data: contract.methods.publicSaleMint(mintAmount).encodeABI(),
        nonce: nonce.toString(16) // hex value
    }

    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [tx]
        });
        return {
            success: true,
            status: (
                <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">
                    <p>Check out your transaction on Etherscan:</p>
                    <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
                </a>
            )
        }
    } catch (error) {
        return {
            success: false,
            status: "Error: " + error.message
        }
    }
}
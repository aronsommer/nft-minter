import { contract_address } from './database.js';
import { cidOfUploadedJSON } from './nft-storage.js';
import { loadingAnimation } from './helpers.js';

if (window.ethereum) {
    // Detect account change
    window.ethereum.on('accountsChanged', function (accounts) {
        console.log("Account was changed");
        location.reload();
    })
    // Detect network change
    window.ethereum.on('chainChanged', function (networkId) {
        console.log("Network was changed");
        location.reload();
    })
}

getNetworkAndAccount();
export let account = null;
// Get network ID and wallet account
async function getNetworkAndAccount() {
    if (!window.ethereum) {
        console.log("No ethereum provider");
        document.getElementById('connected-network').style.color = "red";
        document.getElementById('connected-network').textContent = "No ethereum provider. Check your wallet extension!";
        document.getElementById('wallet-account').style.color = "red";
        document.getElementById('wallet-account').textContent = "No account connected. Connect in wallet extension!";
    }
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        // Get network ID
        const networkId = await web3.eth.net.getId();
        console.log("Network ID: " + networkId);
        if (networkId == 11155111) {
            console.log("Connected to Sepolia testnet");
            document.getElementById('connected-network').textContent = "You are connected to the Sepolia testnet";
        }
        if (networkId != 11155111) {
            console.log("Not connected to Sepolia testnet");
            document.getElementById('connected-network').style.color = "red";
            document.getElementById('connected-network').textContent = "Switch network to Sepolia testnet and refresh page!";
        }
        // Get wallet account
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            account = accounts[0];
            console.log("User's account is: " + account);
            document.getElementById('wallet-account').textContent = "Your account: " + account;
            document.getElementById("receiverInput").placeholder = account;
            // Show login table if wallet account found and in Sepolia testnet
            if (networkId == 11155111) {
                document.getElementById('login-table').style.display = "table";
                document.getElementById("passwordInput").focus();
            }
        } catch (e) {
            console.log("Error in eth_requestAccounts", e);
            document.getElementById('wallet-account').style.color = "red";
            document.getElementById('wallet-account').textContent = "No account connected";
        }
    }
}

let contract = null;
import { CONTRACT_ABI } from './contract-abi.js';
let CONTRACT_ADDRESS = null;
// Mint NFT
export async function mintNFT() {
    CONTRACT_ADDRESS = contract_address;
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        let data = document.getElementById('dataInput').value;
        let receiverAccount = document.getElementById('receiverInput').value;
        if (!receiverAccount) { receiverAccount = account; }
        // let tokenId = document.getElementById('tokenIdInput').value;
        // let amount = document.getElementById('tokenAmountInput').value;
        // Check for the right arguments for mint function
        if (receiverAccount && cidOfUploadedJSON != null) {
            loadingAnimation(true);
            // contract.methods.mint(receiverAccount, tokenId, amount, "ipfs://" + cidOfUploadedJSON, []).send({ from: account, value: 0 })
            contract.methods.mint(receiverAccount, "ipfs://" + cidOfUploadedJSON, web3.utils.asciiToHex(data)).send({ from: account, value: 0 })
                .on("transactionHash", function (hash) {
                    console.log("Transaction hash: " + hash);
                    loadingAnimation(false);
                    document.getElementById("log").innerHTML = "<a href=\"https://sepolia.etherscan.io/tx/"
                        + hash
                        + "\" target=\"_blank\">View transaction on Etherscan</a>"
                        + "<br>"
                        + "<a href=\"https://testnets.opensea.io/assets/sepolia/"
                        + CONTRACT_ADDRESS
                        // + "/"
                        // + tokenId
                        + "\" target=\"_blank\">View NFT on OpenSea</a>"
                })
                .on("receipt", function (receipt) {
                    alert("Mint done! :)")
                })
                .catch((error) => {
                    const err = error.toJSON();
                    console.log(err);
                    loadingAnimation(false);
                })
        }
        // Wrong arguments for mint function detected
        else {
            console.log("Wrong arguments for mint function:");
            console.log("receiverAccount: " + receiverAccount);
            // console.log("tokenId: " + tokenId);
            // console.log("amount: " + amount);
            console.log("cidOfUploadedJSON: " + cidOfUploadedJSON);
            if (cidOfUploadedJSON == null) {
                document.getElementById("log").innerHTML = "Please upload JSON file before minting!";
            }
        }
    }
}
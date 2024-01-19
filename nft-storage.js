import { nfts_api_key } from './database.js';
import { loadingAnimation } from './helpers.js';

// Check if NFT type is image
function isNftTypeImage() {
    const nftType = document.querySelectorAll('input[name="nftType"]')
    for (const t of nftType) {
        if (t.checked) {
            if (t.value == "image") {
                return true;
            }
        }
    }
}

let payloadImage = null;
// Add selected image to payloadImage
imageInput.onchange = function (event) {
    if (event.target.value != null) {
        payloadImage = event.target.files[0];
    }
};
previewImageInput.onchange = function (event) {
    if (event.target.value != null) {
        payloadImage = event.target.files[0];
    }
};

let cidOfUploadedImage = null;
// Upload image to NFT.Storage
export async function NftStorageUploadImage() {
    // If no image selected return
    if (payloadImage == null) {
        console.log("payloadImage == null");
        document.getElementById("log").innerHTML = "Please select image before uploading!";
        return;
    }
    loadingAnimation(true);
    document.getElementById("log").innerHTML = "Uploading image to NFT.Storage...";
    try {
        const response = await fetch("https://api.nft.storage/upload", {
            method: "POST",
            body: payloadImage,
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + nfts_api_key,
                "Content-Type": "*/*"
            }
        });
        const result = await response.json();
        console.log("Success:", result);
        cidOfUploadedImage = result.value.cid;
        loadingAnimation(false);
        document.getElementById("log").innerHTML = "Upload of image to NFT.Storage complete: "
            + "<a href=\"https://nftstorage.link/ipfs/"
            + cidOfUploadedImage
            + "\" target=\"_blank\">View image</a>"
            + "<br>"
            + "ipfs://"
            + cidOfUploadedImage;
    } catch (error) {
        console.error("Error:", error);
        loadingAnimation(false);
    }
}

let payloadFile = null;
// Add selected file to payloadFile
fileInput.onchange = function (event) {
    if (event.target.value != null) {
        payloadFile = event.target.files[0];
    }
};

let cidOfUploadedFile = null;
// Upload file to NFT.Storage
export async function NftStorageUploadFile() {
    // If no file selected return
    if (payloadFile == null) {
        console.log("payloadFile == null");
        document.getElementById("log").innerHTML = "Please select file before uploading!";
        return;
    }
    loadingAnimation(true);
    document.getElementById("log").innerHTML = "Uploading file to NFT.Storage...";
    try {
        const response = await fetch("https://api.nft.storage/upload", {
            method: "POST",
            body: payloadFile,
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + nfts_api_key,
                "Content-Type": "*/*"
            }
        });
        const result = await response.json();
        console.log("Success:", result);
        cidOfUploadedFile = result.value.cid;
        loadingAnimation(false);
        document.getElementById("log").innerHTML = "Upload of file to NFT.Storage complete: "
            + "<a href=\"https://nftstorage.link/ipfs/"
            + cidOfUploadedFile
            + "\" target=\"_blank\">View file</a>"
            + "<br>"
            + "ipfs://"
            + cidOfUploadedFile;
    } catch (error) {
        console.error("Error:", error);
        loadingAnimation(false);
    }
}

export let cidOfUploadedJSON = null;
// Upload JSON to NFT.Storage
export async function NftStorageUploadJSON() {
    // If NFT type image and no image uploaded return
    if (isNftTypeImage() && cidOfUploadedImage == null) {
        console.log("cidOfUploadedImage == null");
        document.getElementById("log").innerHTML = "Please upload image before uploading JSON!";
        return;
    }
    // If NFT type file and no image or file uploaded return
    if (!isNftTypeImage()) {
        if (cidOfUploadedImage == null) {
            console.log("cidOfUploadedImage == null");
            document.getElementById("log").innerHTML = "Please upload image before uploading JSON!";
            return;
        }
        if (cidOfUploadedFile == null) {
            console.log("cidOfUploadedFile == null");
            document.getElementById("log").innerHTML = "Please upload file before uploading JSON!";
            return;
        }
    }
    loadingAnimation(true);
    document.getElementById("log").innerHTML = "Uploading JSON to NFT.Storage...";
    try {
        let response = null;
        // If NFT type is image
        if (isNftTypeImage()) {
            response = await fetch("https://api.nft.storage/upload", {
                method: "POST",
                body: JSON.stringify({
                    name: document.getElementById('nameInput').value,
                    description: document.getElementById('descriptionInput').value,
                    image: "ipfs://" + cidOfUploadedImage
                }),
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer " + nfts_api_key,
                    "Content-Type": "*/*"
                }
            });
        }
        // If NFT type is HTML file
        if (!isNftTypeImage()) {
            response = await fetch("https://api.nft.storage/upload", {
                method: "POST",
                body: JSON.stringify({
                    name: document.getElementById('nameInput').value,
                    description: document.getElementById('descriptionInput').value,
                    image: "ipfs://" + cidOfUploadedImage,
                    animation_url: "ipfs://" + cidOfUploadedFile,
                }),
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer " + nfts_api_key,
                    "Content-Type": "*/*"
                }
            });
        }
        const result = await response.json();
        console.log("Success:", result);
        cidOfUploadedJSON = result.value.cid;
        loadingAnimation(false);
        document.getElementById("log").innerHTML = "Upload of JSON to NFT.Storage complete: "
            + "<a href=\"https://nftstorage.link/ipfs/"
            + cidOfUploadedJSON
            + "\" target=\"_blank\">View JSON</a>"
            + "<br>"
            + "ipfs://"
            + cidOfUploadedJSON;
    } catch (error) {
        console.error("Error:", error);
        loadingAnimation(false);
    }
}
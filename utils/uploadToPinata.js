const path = require("path");
const fs = require("fs");
const PinataSDK = require("@pinata/sdk");
require("dotenv").config();

const pinata = new PinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

const uploadImages = async (imagesPath = "./images/RandomNFT") => {
    console.log("\x1b[33m%s\x1b[0m", "Uploading Images to pinata, Please wait...");
    const fullImagesPath = path.resolve(imagesPath);

    const allImagesCollection = fs.readdirSync(fullImagesPath, "utf8");

    const storedImagesResponse = [];

    for (const image of allImagesCollection) {
        console.log("\x1b[33m%s\x1b[0m", `Uploading ${image}, Please wait...`);

        const imageReadableStream = fs.createReadStream(`${fullImagesPath}/${image}`);
        const options = {
            pinataMetadata: {
                name: image,
            },
        };

        try {
            const response = await pinata.pinFileToIPFS(imageReadableStream, options);
            storedImagesResponse.push(response);
        } catch (e) {
            console.log("\x1b[31m%s\x1b[0m", `uploadToPinata.js --ERROR: ${e}`);
        }
    }

    console.log("\x1b[32m%s\x1b[0m", "Images Uploaded Successfully!");

    return {
        storedImagesResponse,
        allImagesCollection,
    };
};

const uploadJsonUris = async (jsonToUpload) => {
    try {
        const response = await pinata.pinJSONToIPFS(jsonToUpload);
        return response;
    } catch (e) {
        console.log("\x1b[31m%s\x1b[0m", `uploadToPinata.js --ERROR: ${e}`);
    }
};

module.exports = {
    uploadImages,
    uploadJsonUris,
};

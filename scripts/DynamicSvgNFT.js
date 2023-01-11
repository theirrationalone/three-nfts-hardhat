const { ethers } = require("hardhat");

const DynamicSvgNFT = async () => {
    const { deployer } = await getNamedAccounts();
    const DynamicSvgNFT = await ethers.getContract("DynamicSvgNFT", deployer);
    console.log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    console.log("\x1b[33m%s\x1b[0m", "Minting DynamicSvgNFT, Please wait...");

    await new Promise(async (resolve, reject) => {
        DynamicSvgNFT.once("NFTMinted", async (minter, tokenId, highValue) => {
            try {
                console.log(
                    "\x1b[36m%s\x1b[0m",
                    `DynamicSvgNFT with tokenId: ${tokenId.toString()} and NFT Owner with address: ${minter} has been minted!`
                );

                console.log("\x1b[36m%s\x1b[0m", `highValue: ${ethers.utils.formatEther(highValue.toString())}`);

                resolve();
            } catch (e) {
                console.log("\x1b[31m%s\x1b[0m", `mint.js -- ERROR: ${e}`);
                reject(e);
            }
        });

        const dynamicSvgIntNFTTxResponse = await DynamicSvgNFT.mintNFT(ethers.utils.parseEther("0.04").toString());
        await dynamicSvgIntNFTTxResponse.wait(1);
    });

    console.log("\x1b[32m%s\x1b[0m", "RandomIpfsNFT Minted Successfully!");
    console.log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    console.log("");
};

DynamicSvgNFT()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log("\x1b[31m%s\x1b[0m", `DynamicSvgNFT - scripts -- ERROR: ${err}`);
        process.exit(1);
    });

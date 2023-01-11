const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { log } = await deployments;

    log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    log("\x1b[33m%s\x1b[0m", "Minting BasicNFT, Please wait...");

    const BasicNFT = await ethers.getContract("BasicNFT", deployer);
    await new Promise(async (resolve, reject) => {
        BasicNFT.once("NFTMinted", async (nftOwner, tokenId) => {
            try {
                log(
                    "\x1b[36m%s\x1b[0m",
                    `BasicNFT with tokenId: ${tokenId.toString()} and NFT Owner with address: ${nftOwner} has been minted!`
                );
                resolve();
            } catch (e) {
                log("\x1b[31m%s\x1b[0m", `mint.js -- ERROR: ${e}`);
                reject(e);
            }
        });

        const basicNFTTxResponse = await BasicNFT.mintNFT();
        await basicNFTTxResponse.wait(1);
    });

    log("\x1b[32m%s\x1b[0m", "BasicNFT Minted Successfully!");
    log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    log("");

    log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    log("\x1b[33m%s\x1b[0m", "Minting RandomIpfsNFT, Please wait...");

    const RandomIpfsNFT = await ethers.getContract("RandomIpfsNFT", deployer);
    await new Promise(async (resolve, reject) => {
        RandomIpfsNFT.once("NFTMinted", async (dogBreed, dogOwner, tokenId) => {
            try {
                log(
                    "\x1b[36m%s\x1b[0m",
                    `RandomIpfsNFT with tokenId: ${tokenId.toString()} and NFT Owner with address: ${dogOwner} has been minted!`
                );

                log("\x1b[36m%s\x1b[0m", `Dog Breed Uri Index: ${dogBreed}`);

                resolve();
            } catch (e) {
                log("\x1b[31m%s\x1b[0m", `mint.js -- ERROR: ${e}`);
                reject(e);
            }
        });

        const requestNFTTxResponse = await RandomIpfsNFT.requestNFT({
            value: ethers.utils.parseEther("0.01").toString(),
        });
        const requestNFTReceipt = await requestNFTTxResponse.wait(1);

        if (!!developmentChains.includes(network.name)) {
            const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);

            const requestId = requestNFTReceipt.events[1].args.requestId;

            const vrfCoordinatorTxResponse = await VRFCoordinatorV2Mock.fulfillRandomWords(
                requestId.toString(),
                RandomIpfsNFT.address
            );
            await vrfCoordinatorTxResponse.wait(1);
        }
    });

    log("\x1b[32m%s\x1b[0m", "RandomIpfsNFT Minted Successfully!");
    log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    log("");

    log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    log("\x1b[33m%s\x1b[0m", "Minting DynamicSvgNFT, Please wait...");

    const DynamicSvgNFT = await ethers.getContract("DynamicSvgNFT", deployer);
    await new Promise(async (resolve, reject) => {
        DynamicSvgNFT.once("NFTMinted", async (minter, tokenId, highValue) => {
            try {
                log(
                    "\x1b[36m%s\x1b[0m",
                    `DynamicSvgNFT with tokenId: ${tokenId.toString()} and NFT Owner with address: ${minter} has been minted!`
                );

                log("\x1b[36m%s\x1b[0m", `highValue: ${ethers.utils.formatEther(highValue.toString())}`);

                resolve();
            } catch (e) {
                log("\x1b[31m%s\x1b[0m", `mint.js -- ERROR: ${e}`);
                reject(e);
            }
        });

        const dynamicSvgIntNFTTxResponse = await DynamicSvgNFT.mintNFT(ethers.utils.parseEther("0.04").toString());
        await dynamicSvgIntNFTTxResponse.wait(1);
    });

    log("\x1b[32m%s\x1b[0m", "RandomIpfsNFT Minted Successfully!");
    log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    log("");
};
module.exports.tags = ["mint"];

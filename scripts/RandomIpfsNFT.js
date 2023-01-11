const { getNamedAccounts, ethers } = require("hardhat");

const { developmentChains } = require("../helper-config");

const RandomIpfsNFT = async () => {
    const { deployer } = await getNamedAccounts();
    const RandomIpfsNFTContract = await ethers.getContract("RandomIpfsNFT", deployer);

    console.log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    console.log("\x1b[33m%s\x1b[0m", "Fetching Current Token Id, Please wait...");

    const currentToken = await RandomIpfsNFTContract.getTokenCounter();

    console.log("\x1b[36m%s\x1b[0m", `Current TokenId: ${currentToken.toString()}`);
    console.log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    console.log("");

    console.log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    console.log("\x1b[33m%s\x1b[0m", "Minting RandomIpfsNFT, Please wait...");

    await new Promise(async (resolve, reject) => {
        RandomIpfsNFTContract.once("NFTMinted", async (dogBreed, dogOwner, tokenId) => {
            try {
                console.log(
                    "\x1b[36m%s\x1b[0m",
                    `RandomIpfsNFT with tokenId: ${tokenId.toString()} and NFT Owner with address: ${dogOwner} has been minted!`
                );

                console.log("\x1b[36m%s\x1b[0m", `Dog Breed Uri Index: ${dogBreed}`);

                console.log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
                console.log("\x1b[33m%s\x1b[0m", "Fetching Dog URI, Please wait...");

                const dogTokenURI = await RandomIpfsNFTContract.tokenURI(tokenId.toString());

                console.log("\x1b[36m%s\x1b[0m", `DOG TokenURI: ${dogTokenURI.toString()}`);
                console.log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");

                resolve();
            } catch (e) {
                console.log("\x1b[31m%s\x1b[0m", `mint.js -- ERROR: ${e}`);
                reject(e);
            }
        });

        const requestNFTTxResponse = await RandomIpfsNFTContract.requestNFT({
            value: ethers.utils.parseEther("0.01").toString(),
        });
        const requestNFTReceipt = await requestNFTTxResponse.wait(1);

        if (!!developmentChains.includes(network.name)) {
            const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);

            const requestId = requestNFTReceipt.events[1].args.requestId;

            const vrfCoordinatorTxResponse = await VRFCoordinatorV2Mock.fulfillRandomWords(
                requestId.toString(),
                RandomIpfsNFTContract.address
            );
            await vrfCoordinatorTxResponse.wait(1);
        }
    });

    console.log("\x1b[32m%s\x1b[0m", "RandomIpfsNFT Minted Successfully!");
    console.log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    console.log("");

    console.log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    console.log("\x1b[33m%s\x1b[0m", "Updated Current Token Id, Please wait...");

    const updatedTokenId = await RandomIpfsNFTContract.getTokenCounter();

    console.log("\x1b[36m%s\x1b[0m", `Updated TokenId: ${updatedTokenId.toString()}`);
    console.log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    console.log("");
};

RandomIpfsNFT()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log("\x1b[31m%s\x1b[0m", `RandomIpfsNFT.js -- scripts -- ERROR: ${e}`);
        process.exit(1);
    });

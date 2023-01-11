const { network, ethers } = require("hardhat");
require("dotenv").config();

const { developmentChains, networkConfig } = require("../helper-config");
const { uploadImages, uploadJsonUris } = require("../utils/uploadToPinata");
const verify = require("../utils/verify");

const imagesPath = "./images/RandomNFT";
const pinataMetadata = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            traitType: "Cuteness",
            value: "100",
        },
    ],
};
let dogsUris = [
    "ipfs://QmQUWXuwgBRstoJRTe6K15J8m75J41QsVi8G4N7ZZAfCpZ",
    "ipfs://QmUqQomRc3gc3FQUvMRtGXY5WBrtqTvEvmfZVa69rfDi4r",
    "ipfs://QmaEuByjiDWQ6SwFe7FC4cX7r63LYWTmgyYkx7V9tRePH3",
];

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const chainId = network.config.chainId.toString();
    let VRFCoordinatorV2Mock, vrfCoordinatorV2Address, subscriptionId;

    if (!!process.env.UPLOAD_TO_PINATA && dogsUris.length <= 0) {
        dogsUris = await handleUrisUploadToPinata();
    }

    if (!!developmentChains.includes(network.name)) {
        VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
        vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address;
        const txResponse = await VRFCoordinatorV2Mock.createSubscription();
        const txReceipt = await txResponse.wait(1);
        subscriptionId = txReceipt.events[0].args.subId;
        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, ethers.utils.parseEther("5"));
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2Address"];
        subscriptionId = networkConfig[chainId]["subscriptionId"];
    }

    const gasLane = networkConfig[chainId]["gasLane"];
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];
    const mintFee = await networkConfig[chainId]["mintFee"];

    const args = [vrfCoordinatorV2Address, gasLane, subscriptionId, callbackGasLimit, mintFee, dogsUris];

    log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    log("\x1b[33m%s\x1b[0m", "Deploying RandomIpfsNFT Contract, Please wait...");

    const RandomIpfsNFT = await deploy("RandomIpfsNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log("\x1b[32m%s\x1b[0m", "RandomIpfsNFT Deployed Successfully!");
    log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    log("");

    if (!developmentChains.includes(network.name) && !!process.env.ETHERSCAN_API_KEY) {
        log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");

        await verify(RandomIpfsNFT.address, args);

        log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
        log("");
    }

    if (!!developmentChains.includes(network.name)) {
        log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
        log("\x1b[33m%s\x1b[0m", "Adding Consumer, Please wait...");

        await VRFCoordinatorV2Mock.addConsumer(subscriptionId, RandomIpfsNFT.address);

        log("\x1b[32m%s\x1b[0m", "Consumer Added Successfully!");
        log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
        log("");
    }
};

module.exports.tags = ["all", "RandomIpfs", "main"];

const handleUrisUploadToPinata = async () => {
    const dogTokenUris = [];
    const { storedImagesResponse: responses, allImagesCollection: allImages } = await uploadImages(imagesPath);

    const tokenUriMetadata = { ...pinataMetadata };

    for (const responseIndex in responses) {
        tokenUriMetadata.name = allImages[responseIndex].replace(".png", "");
        tokenUriMetadata.description = `An Adorable ${tokenUriMetadata.name.toUpperCase()} Pup!`;
        tokenUriMetadata.image = `ipfs://${responses[responseIndex].IpfsHash}`;

        console.log("\x1b[33m%s\x1b[0m", `Uploading ${tokenUriMetadata.name}, Please wait...`);
        const UriResponse = await uploadJsonUris(tokenUriMetadata);
        dogTokenUris.push(`ipfs://${UriResponse.IpfsHash}`);
    }

    console.log("\x1b[32m%s\x1b[0m", "Dog Uris Uploaded Successfully!");
    console.log("\x1b[36m%s\x1b[0m", `URIs: ${dogTokenUris}`);

    return dogTokenUris;
};

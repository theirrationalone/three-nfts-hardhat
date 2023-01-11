const { ethers } = require("hardhat");

const networkConfig = {
    5: {
        name: "goerli",
        ethUsdPriceFeedAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        vrfCoordinatorV2Address: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId: "7569",
        callbackGasLimit: "500000",
        mintFee: ethers.utils.parseEther("0.01").toString(),
    },
    31337: {
        name: "localhost",
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callbackGasLimit: "500000",
        mintFee: ethers.utils.parseEther("0.01").toString(),
    },
};

const developmentChains = ["hardhat", "localhost"];

const DECIMALS = "18";
const INITIAL_ANSWER = "2000000000000000000";

const BASE_FEE = ethers.utils.parseEther("0.25").toString();
const GAS_PRICE_LINK = 1e9;

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
    BASE_FEE,
    GAS_PRICE_LINK,
};

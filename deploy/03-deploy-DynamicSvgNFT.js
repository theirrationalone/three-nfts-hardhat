const fs = require("fs");
const { ethers, network } = require("hardhat");
require("dotenv").config();

const { developmentChains, networkConfig } = require("../helper-config");
const verify = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;

    if (!!developmentChains.includes(network.name)) {
        const MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
        ethUsdPriceFeedAddress = MockV3Aggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"];
    }

    const lowSvg = fs.readFileSync("./images/DynamicNFT/frown.svg", "utf8");
    const highSvg = fs.readFileSync("./images/DynamicNFT/happy.svg", "utf8");

    const args = [ethUsdPriceFeedAddress, lowSvg, highSvg];

    log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    log("\x1b[33m%s\x1b[0m", "Deploying DynamicSvgNFT Contract, Please wait...");

    const DynamicSvgNFT = await deploy("DynamicSvgNFT", {
        from: deployer,
        args: args,
        log: true,
        allowConfirmations: network.config.blockConfirmations || 1,
    });

    log("\x1b[32m%s\x1b[0m", "DynamicSvgNFT Deployed Successfully!");
    log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
    log("");

    if (!developmentChains.includes(network.name) && !!process.env.ETHERSCAN_API_KEY) {
        log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");

        await verify(DynamicSvgNFT.address, args);

        log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
        log("");
    }
};
module.exports.tags = ["all", "DynamicSvgNFT", "main"];

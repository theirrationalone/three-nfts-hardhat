const { network } = require("hardhat");
const { developmentChains, BASE_FEE, GAS_PRICE_LINK, DECIMALS, INITIAL_ANSWER } = require("../helper-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = await deployments;

    if (!!developmentChains.includes(network.name)) {
        log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
        log("\x1b[33m%s\x1b[0m", "Local Network detected deploying Mocks, Please wait...");

        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: [BASE_FEE, GAS_PRICE_LINK],
            log: true,
        });

        log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
        log("");
        log("");
        log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");

        await deploy("MockV3Aggregator", {
            from: deployer,
            args: [DECIMALS, INITIAL_ANSWER],
            log: true,
        });

        log("\x1b[32m%s\x1b[0m", "Mocks Deployed Successfully!");
        log("\x1b[34m%s\x1b[0m", "------------------------------------------------------------");
        log("");
    }
};

module.exports.tags = ["all", "mocks", "main"];

const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { assert, expect } = require("chai");

const { developmentChains } = require("../../helper-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("\x1b[35mDynamicSvgNFT -- Unit Testing\x1b[0m", () => {
          let DynamicSvgNFT, deployer, MockV3Aggregator;
          const imghighValue = ethers.utils.parseEther("2.0").toString(); // 2.0 ETH is the max amount for happy face 😊 svg on localhost
          //   const imghighValue = ethers.utils.parseEther("2.1").toString(); // for sad face 😔 svg on localhost
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              const { fixture } = deployments;
              await fixture(["all"]);

              DynamicSvgNFT = await ethers.getContract("DynamicSvgNFT", deployer);
              MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
          });

          describe("\x1b[30mconstructor\x1b[0m", () => {
              it("\x1b[34mShould set \x1b[36m'priceFeed Address' \x1b[34mCorrectly!\x1b[0m", async () => {
                  const ethUsdPriceFeedAddress = await DynamicSvgNFT.getPriceFeedAddress();

                  console.log("\x1b[32m%s\x1b[0m", `ethUsdPriceFeedAddress: ${ethUsdPriceFeedAddress}`);

                  assert.equal(ethUsdPriceFeedAddress, MockV3Aggregator.address);
              });

              it("\x1b[34mShould have \x1b[36m'Token Counter' \x1b[34mequals to 0 initially!\x1b[0m", async () => {
                  const tokenCounter = await DynamicSvgNFT.getCurrentTokenId();

                  console.log("\x1b[32m%s\x1b[0m", `tokenCounter: ${tokenCounter.toString()}`);

                  assert.equal(tokenCounter.toString(), "0");
              });

              it("\x1b[34mShould set \x1b[36m'low svg' \x1b[34mCorrectly!\x1b[0m", async () => {
                  const lowSvg = await DynamicSvgNFT.getLowSvg();

                  console.log("\x1b[32m%s\x1b[0m", `lowSvg: ${lowSvg.toString()}`);

                  expect(lowSvg.length).greaterThan(0);
              });

              it("\x1b[34mShould set \x1b[36m'high svg' \x1b[34mCorrectly!\x1b[0m", async () => {
                  const highSvg = await DynamicSvgNFT.getHighSvg();

                  console.log("\x1b[32m%s\x1b[0m", `highSvg: ${highSvg.toString()}`);

                  expect(highSvg.length).greaterThan(0);
              });

              it("\x1b[34mShould have correct \x1b[36m'BASE64 ENCODED SVG PREFIX' \x1b[34m!\x1b[0m", async () => {
                  const base64EncodedSvgPrefix = await DynamicSvgNFT.getBase64EncodedSvgPrefix();

                  console.log("\x1b[32m%s\x1b[0m", `Base64 Encoded SVG Prefix: ${base64EncodedSvgPrefix}`);

                  assert.equal(base64EncodedSvgPrefix, "data:image/svg+xml;base64,");
              });

              it("\x1b[34mShould have correct \x1b[36m'BASE64 ENCODED JSON PREFIX' \x1b[34m!\x1b[0m", async () => {
                  const base64EncodedJsonPrefix = await DynamicSvgNFT.getBase64EncodedJsonPrefix();

                  console.log("\x1b[32m%s\x1b[0m", `Base64 Encoded SVG Prefix: ${base64EncodedJsonPrefix}`);

                  assert.equal(base64EncodedJsonPrefix, "data:application/json;base64,");
              });

              it("\x1b[34mShould be reverted if \x1b[36m'getMappedHighValueToTokenId' \x1b[34minvoked during instanciation!\x1b[0m", async () => {
                  expect(await DynamicSvgNFT.getMappedHighValueToTokenId("0")).to.be.reverted;
              });
          });

          describe("\x1b[30mmintNFT\x1b[0m", () => {
              it("\x1b[34mShould Map high value to tokenId Correctly!\x1b[0m", async () => {
                  const txResponse = await DynamicSvgNFT.mintNFT(imghighValue);
                  const txReceipt = await txResponse.wait(1);

                  const tokenId = txReceipt.events[0].args.tokenId.toString();

                  const highValue = await DynamicSvgNFT.getMappedHighValueToTokenId(tokenId);

                  console.log("\x1b[32m%s\x1b[0m", `tokenId: ${tokenId}`);
                  console.log("\x1b[32m%s\x1b[0m", `highValue: ${ethers.utils.formatEther(highValue.toString())}`);

                  assert.equal(highValue.toString(), imghighValue);
              });

              it("\x1b[34mShould mint NFT Successfully!\x1b[0m", async () => {
                  await expect(DynamicSvgNFT.mintNFT(imghighValue)).not.to.be.reverted;
              });

              it("\x1b[34mShould emit an event named \x1b[36m'NFTMinted' \x1b[34mSuccessfully!\x1b[0m", async () => {
                  await expect(DynamicSvgNFT.mintNFT(imghighValue)).emit(DynamicSvgNFT, "NFTMinted");
              });

              it("\x1b[34mShould emit and listen an event named \x1b[36m'NFTMinted' \x1b[34mSuccessfully!\x1b[0m", async () => {
                  await new Promise(async (resolve, reject) => {
                      DynamicSvgNFT.once("NFTMinted", async (minter, tokenId, highValue) => {
                          try {
                              const tokenURI = await DynamicSvgNFT.tokenURI(tokenId.toString());

                              console.log(
                                  "\x1b[36m%s\x1b[0m",
                                  `DynamicSvgNFT with tokenId: ${tokenId.toString()} and NFT Owner with address: ${minter} has been minted!`
                              );

                              console.log(
                                  "\x1b[36m%s\x1b[0m",
                                  `highValue: ${ethers.utils.formatEther(highValue.toString())}`
                              );

                              console.log("\x1b[36m%s\x1b[0m", `tokenURI: ${tokenURI.toString()}`);

                              assert.equal(minter, deployer);
                              assert.equal(highValue.toString(), imghighValue);
                              assert.notEqual(tokenURI.length, "0");
                              resolve();
                          } catch (e) {
                              log("\x1b[31m%s\x1b[0m", `mint.js -- ERROR: ${e}`);
                              reject(e);
                          }
                      });

                      const dynamicSvgIntNFTTxResponse = await DynamicSvgNFT.mintNFT(imghighValue);

                      await dynamicSvgIntNFTTxResponse.wait(1);
                      console.log("\x1b[33m%s\x1b[0m", "Waiting for NFT to be MINTED...");
                  });
              });

              it("\x1b[34mShould be reverted if \x1b[36m'tokenURI' \x1b[0minvoked with invalid tokenId!\x1b[0m", async () => {
                  await expect(DynamicSvgNFT.tokenURI("10")).to.be.reverted;
              });

              it("\x1b[34mShould be reverted with msg \x1b[36m'DynamicSvgNFT__nonexistentTokenUriQuery' \x1b[34mif \x1b[36m'tokenURI' \x1b[0minvoked with invalid tokenId!\x1b[0m", async () => {
                  await expect(DynamicSvgNFT.tokenURI("10")).to.be.revertedWithCustomError(
                      DynamicSvgNFT,
                      "DynamicSvgNFT__nonexistentTokenUriQuery"
                  );
              });
          });
      });

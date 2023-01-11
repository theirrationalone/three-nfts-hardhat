const { network, getNamedAccounts, ethers } = require("hardhat");
const { assert } = require("chai");

const { developmentChains } = require("../../helper-config");

!!developmentChains.includes(network.name)
    ? describe.skip
    : describe("\x1b[35mDynamicSvgNFT -- Staging Testing\x1b[0m", () => {
          let DynamicSvgNFT, deployer;
          const imghighValue = ethers.utils.parseEther("0.04").toString();
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;

              DynamicSvgNFT = await ethers.getContract("DynamicSvgNFT", deployer);
          });

          describe("\x1b[30mmintNFT\x1b[0m", () => {
              it("\x1b[34mShould emit and listen an Event named \x1b[36m'NFTMinted' \x1b[34mon successful Minting!\x1b[0m", async () => {
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
          });
      });

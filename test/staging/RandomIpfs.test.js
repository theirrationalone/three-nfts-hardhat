const { network, getNamedAccounts, ethers } = require("hardhat");
const { assert, expect } = require("chai");

const { developmentChains } = require("../../helper-config");

!!developmentChains.includes(network.name)
    ? describe.skip
    : describe("\x1b[35mRandomIpfsNFT -- Staging Testing\x1b[0m", () => {
          let RandomIpfsNFT, deployer, mintFee;
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              RandomIpfsNFT = await ethers.getContract("RandomIpfsNFT", deployer);
              mintFee = await RandomIpfsNFT.getMintFee();
          });

          it("\x1b[34mWorks with Live Chain and allow multiple users to request NFT, Mint NFT and allow owner to withdraw NFT Funds!\x1b[0m", async () => {
              await new Promise(async (resolve, reject) => {
                  RandomIpfsNFT.once("NFTMinted", async (dogBreed, dogOwner, tokenId) => {
                      try {
                          console.log("\x1b[32m%s\x1b[0m", `dogBreed Index: ${dogBreed.toString()}`);
                          console.log("\x1b[32m%s\x1b[0m", `dogBreed Owner: ${dogOwner.toString()}`);
                          console.log("\x1b[32m%s\x1b[0m", `tokenId: ${tokenId.toString()}`);

                          const pugUri = await RandomIpfsNFT.getDogsUri("0");
                          const shibaINUUri = await RandomIpfsNFT.getDogsUri("1");
                          const stBernardUri = await RandomIpfsNFT.getDogsUri("2");

                          const allUris = [pugUri, shibaINUUri, stBernardUri];
                          const dogBreeds = ["PUG", "SHIBA-INU", "ST-BERNARD"];

                          const dogUri = await RandomIpfsNFT.tokenURI(tokenId.toString());
                          console.log("\x1b[32m%s\x1b[0m", `${dogBreeds[dogBreed]}: ${dogUri.toString()}`);

                          console.log(
                              `\x1b[32mNFT Balance Before Withdrawal: \x1b[36m${ethers.utils.formatEther(
                                  balanceBeforeWithdrawal.toString()
                              )} ETH`
                          );
                          const txResponse = await RandomIpfsNFT.withdraw();
                          await txResponse.wait(1);

                          const balanceAfterWithdrawal = await getBalance();

                          console.log(
                              `\x1b[32mNFT Balance After Withdrawal: \x1b[36m${ethers.utils.formatEther(
                                  balanceAfterWithdrawal.toString()
                              )} ETH`
                          );

                          assert.equal(
                              balanceBeforeWithdrawal.toString(),
                              mintFee.mul(additionalNFTRequesters + startingRequesterIndex).toString()
                          );
                          assert.equal(balanceAfterWithdrawal.toString(), "0");
                          expect(parseInt(balanceBeforeWithdrawal)).greaterThan(parseInt(balanceAfterWithdrawal));
                          assert.equal(dogUri, allUris[dogBreed.toString()]);
                          resolve();
                      } catch (e) {
                          console.log("\x1b[31m%s\x1b[0m", `RandomIpfs.test.js -- ERROR: ${e}`);
                          reject(e);
                      }
                  });

                  const startingRequesterIndex = 0;
                  const additionalNFTRequesters = 5;

                  for (let i = startingRequesterIndex; i < startingRequesterIndex + additionalNFTRequesters; i++) {
                      const additionalRequestersConnectedRandomIpfsNFT = await RandomIpfsNFT.connect(signers[i]);

                      const txResponse = await additionalRequestersConnectedRandomIpfsNFT.requestNFT({
                          value: mintFee.toString(),
                      });
                      await txResponse.wait(1);
                  }

                  const getBalance = async () => {
                      const balance = await ethers.provider.getBalance(RandomIpfsNFT.address);
                      return balance.toString();
                  };

                  const balanceBeforeWithdrawal = await getBalance();

                  console.log("\x1b[33m%s\x1b[0m", "Waiting for NFT to be MINTED...");
              });
          });
      });

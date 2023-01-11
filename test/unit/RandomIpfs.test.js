const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { assert, expect } = require("chai");

const { developmentChains } = require("../../helper-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("\x1b[35mRandomIpfsNFT -- Unit Testing\x1b[0m", () => {
          let RandomIpfsNFT, deployer, VRFCoordinatorV2Mock, mintFee;
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              const { fixture } = deployments;
              await fixture(["all"]);

              RandomIpfsNFT = await ethers.getContract("RandomIpfsNFT", deployer);
              mintFee = await RandomIpfsNFT.getMintFee();
              VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
          });

          describe("\x1b[30mconstructor\x1b[0m", () => {
              it("\x1b[34mShould have \x1b[36m'gasLane' \x1b[34minitially!\x1b[0m", async () => {
                  const gasLane = await RandomIpfsNFT.getGasLane();

                  console.log("\x1b[32m%s\x1b[0m", `gasLane: ${gasLane.toString()}`);

                  assert.notEqual(gasLane.toString(), "0");
              });

              it("\x1b[34mShould have correct \x1b[36m'VRFCoordinatorV2Address' \x1b[34mSetUp initially!\x1b[0m", async () => {
                  const VRFCoordinatorV2Address = await RandomIpfsNFT.getVRFCoordinatorV2Address();

                  console.log("\x1b[32m%s\x1b[0m", `VRFCoordinatorV2Address: ${VRFCoordinatorV2Address.toString()}`);

                  assert.equal(VRFCoordinatorV2Address, VRFCoordinatorV2Mock.address);
              });

              it("\x1b[34mShould have \x1b[36m'subscriptionId' \x1b[34minitially!\x1b[0m", async () => {
                  const subscriptionId = await RandomIpfsNFT.getSubscriptionId();

                  console.log("\x1b[32m%s\x1b[0m", `subscriptionId: ${subscriptionId.toString()}`);

                  assert.notEqual(subscriptionId.toString(), "0");
              });

              it("\x1b[34mShould have \x1b[36m'callbackGasLimit' \x1b[34minitially!\x1b[0m", async () => {
                  const callbackGasLimit = await RandomIpfsNFT.getCallbackGasLimit();

                  console.log("\x1b[32m%s\x1b[0m", `callbackGasLimit: ${callbackGasLimit.toString()}`);

                  assert.notEqual(callbackGasLimit.toString(), "0");
              });

              it("\x1b[34mShould have \x1b[36m'REQUEST CONFIRMATIONS' \x1b[34minitially!\x1b[0m", async () => {
                  const requestConfirmations = await RandomIpfsNFT.getRequestConfirmations();

                  console.log("\x1b[32m%s\x1b[0m", `requestConfirmations: ${requestConfirmations.toString()}`);

                  assert.equal(requestConfirmations.toString(), "3");
              });

              it("\x1b[34mShould have \x1b[36m'NUM WORDS' \x1b[34minitially!\x1b[0m", async () => {
                  const numWords = await RandomIpfsNFT.getNumWords();

                  console.log("\x1b[32m%s\x1b[0m", `numWords: ${numWords.toString()}`);

                  assert.equal(numWords.toString(), "1");
              });

              it("\x1b[34mShould have \x1b[36m'tokenId' \x1b[34mequal to 0 initially!\x1b[0m", async () => {
                  const tokenCounter = await RandomIpfsNFT.getTokenCounter();

                  console.log("\x1b[32m%s\x1b[0m", `tokenCounter: ${tokenCounter.toString()}`);

                  assert.equal(tokenCounter.toString(), "0");
              });

              it("\x1b[34mShould have \x1b[36m'MAX CHANCE' \x1b[34minitially!\x1b[0m", async () => {
                  const maxChance = await RandomIpfsNFT.getMaxChance();

                  console.log("\x1b[32m%s\x1b[0m", `maxChance: ${maxChance.toString()}`);

                  assert.equal(maxChance.toString(), "100");
              });

              it("\x1b[34mShould have \x1b[36m'mintFee' \x1b[34minitially!\x1b[0m", async () => {
                  console.log("\x1b[32m%s\x1b[0m", `mintFee: ${mintFee.toString()}`);

                  assert.equal(mintFee.toString(), ethers.utils.parseEther("0.01").toString());
              });

              it("\x1b[34mShould have \x1b[36m'dogsUris' \x1b[34mLength of 3 initially!\x1b[0m", async () => {
                  const dogsUriLength = await RandomIpfsNFT.getDogsUriLength();
                  console.log("\x1b[32m%s\x1b[0m", `dogsUriLength: ${dogsUriLength.toString()}`);

                  assert.equal(dogsUriLength.toString(), "3");
              });

              it("\x1b[34mShould return correct dog uri !\x1b[0m", async () => {
                  const pugUri = await RandomIpfsNFT.getDogsUri("0");
                  const shibaINUUri = await RandomIpfsNFT.getDogsUri("1");
                  const stBernardUri = await RandomIpfsNFT.getDogsUri("2");

                  console.log("\x1b[32m%s\x1b[0m", `pugUri: ${pugUri.toString()}`);
                  console.log("\x1b[32m%s\x1b[0m", `shibaINUUri: ${shibaINUUri.toString()}`);
                  console.log("\x1b[32m%s\x1b[0m", `stBernardUri: ${stBernardUri.toString()}`);

                  assert(!!pugUri.toString().includes("ipfs://"));
                  assert(!!shibaINUUri.toString().includes("ipfs://"));
                  assert(!!stBernardUri.toString().includes("ipfs://"));
              });

              it("\x1b[34mShould be reverted if \x1b[36m'getDogUriOwnerFromRequestId' \x1b[34mcalled at start!\x1b[0m", async () => {
                  const requestId = await RandomIpfsNFT.getTokenCounter();
                  expect(await RandomIpfsNFT.getDogUriOwnerFromRequestId(requestId.toString())).to.be.reverted;
              });
          });

          describe("\x1b[30mrequestNFT\x1b[0m", () => {
              it("\x1b[34mShould be reverted with msg \x1b[36m'RandomIpfsNFT__notPaidEnoughMintFee' \x1b[34m!\x1b[0m", async () => {
                  await expect(RandomIpfsNFT.requestNFT()).to.be.revertedWithCustomError(
                      RandomIpfsNFT,
                      "RandomIpfsNFT__notPaidEnoughMintFee"
                  );
              });

              it("\x1b[34mShould map dogUri-Owner to requestId correctly !\x1b[0m", async () => {
                  const txResponse = await RandomIpfsNFT.requestNFT({ value: mintFee.toString() });
                  const txReceipt = await txResponse.wait(1);

                  const requestId = await txReceipt.events[1].args.requestId;

                  console.log("\x1b[32m%s\x1b[0m", `requestId: ${requestId.toString()}`);

                  const dogUriOwner = await RandomIpfsNFT.getDogUriOwnerFromRequestId(requestId.toString());

                  console.log("\x1b[32m%s\x1b[0m", `Mapped DogUriOwner: ${dogUriOwner.toString()}`);

                  assert.equal(dogUriOwner, deployer);
              });

              it("\x1b[34mShould emit an event named \x1b[36m'NFTRequested' \x1b[34mon successful request !\x1b[0m", async () => {
                  expect(await RandomIpfsNFT.requestNFT({ value: mintFee.toString() })).to.emit(
                      RandomIpfsNFT,
                      "NFTRequested'"
                  );
              });

              it("\x1b[34mShould emit and listen an event named \x1b[36m'NFTRequested' \x1b[34mon successful request !\x1b[0m", async () => {
                  await new Promise(async (resolve, reject) => {
                      RandomIpfsNFT.once("NFTRequested", async (fetchedRequestId, requester) => {
                          try {
                              console.log("\x1b[32m%s\x1b[0m", `RequestId: ${fetchedRequestId.toString()}`);
                              console.log("\x1b[32m%s\x1b[0m", `Requester: ${requester.toString()}`);

                              assert.equal(fetchedRequestId.toString(), requestId.toString());
                              assert.equal(requester, deployer);
                              resolve();
                          } catch (e) {
                              console.log("\x1b[31m%s\x1b[0m", `RandomIpfs.test.js -- ERROR: ${e}`);
                              reject(e);
                          }
                      });

                      const txResponse = await RandomIpfsNFT.requestNFT({ value: mintFee.toString() });
                      const txReceipt = await txResponse.wait(1);

                      const requestId = await txReceipt.events[1].args.requestId;
                      console.log("\x1b[33m%s\x1b[0m", "Waiting for Event to be Listened...");
                  });
              });
          });

          describe("\x1b[30mfulfillRandomWords\x1b[0m", async () => {
              let requestId;
              beforeEach(async () => {
                  const txResponse = await RandomIpfsNFT.requestNFT({ value: mintFee.toString() });
                  const txReceipt = await txResponse.wait(1);

                  requestId = await txReceipt.events[1].args.requestId;
              });

              it("\x1b[34mShould mint the NFT Successfully!\x1b[0m", async () => {
                  expect(await VRFCoordinatorV2Mock.fulfillRandomWords(requestId.toString(), RandomIpfsNFT.address)).to
                      .not.reverted;
              });

              it("\x1b[34mShould emit an event named \x1b[36m'NFTMinted' \x1b[34msuccessfully!\x1b[0m", async () => {
                  await expect(
                      VRFCoordinatorV2Mock.fulfillRandomWords(requestId.toString(), RandomIpfsNFT.address)
                  ).to.emit(RandomIpfsNFT, "NFTMinted");
              });

              it("\x1b[34mShould set \x1b[36m'tokenURI' \x1b[34mCorrectly on successful NFT Minting!\x1b[0m", async () => {
                  const txResponse = await VRFCoordinatorV2Mock.fulfillRandomWords(
                      requestId.toString(),
                      RandomIpfsNFT.address
                  );
                  txResponse.wait(1);

                  const tokenId = await RandomIpfsNFT.getTokenCounter();

                  const tokenURI = await RandomIpfsNFT.tokenURI(+tokenId.toString() - 1);

                  console.log("\x1b[32m%s\x1b[0m", `tokenId: ${parseInt(tokenId).toString()}`);
                  console.log("\x1b[32m%s\x1b[0m", `Randomly Selected DOG URI: ${tokenURI.toString()}`);

                  const pugUri = await RandomIpfsNFT.getDogsUri("0");
                  const shibaINUUri = await RandomIpfsNFT.getDogsUri("1");
                  const stBernardUri = await RandomIpfsNFT.getDogsUri("2");

                  const allUris = [pugUri, shibaINUUri, stBernardUri];

                  assert(allUris.includes(tokenURI));
              });

              it("\x1b[34mShould Update \x1b[36m'tokenCounter' \x1b[34mCorrectly on Successful NFT Minting!\x1b[0m", async () => {
                  const currentTokenId = await RandomIpfsNFT.getTokenCounter();
                  const txResponse = await VRFCoordinatorV2Mock.fulfillRandomWords(requestId, RandomIpfsNFT.address);
                  await txResponse.wait(1);

                  const updatedTokenId = await RandomIpfsNFT.getTokenCounter();

                  expect(parseInt(updatedTokenId)).greaterThan(parseInt(currentTokenId));
              });

              it("\x1b[34mShould emit and listen the event named \x1b[36m'NFTMinted' \x1b[34mcorrectly!\x1b[0m", async () => {
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

                              assert.equal(dogUri, allUris[dogBreed.toString()]);
                              resolve();
                          } catch (e) {
                              console.log("\x1b[31m%s\x1b[0m", `RandomIpfs.test.js -- ERROR: ${e}`);
                              reject(e);
                          }
                      });

                      const txResponse = await VRFCoordinatorV2Mock.fulfillRandomWords(
                          requestId,
                          RandomIpfsNFT.address
                      );
                      await txResponse.wait(1);

                      console.log("\x1b[33m%s\x1b[0m", "Waiting for NFT to be MINTED...");
                  });
              });
          });

          describe("\x1b[30mwithdraw\x1b[0m", () => {
              let signers;
              beforeEach(async () => {
                  signers = await ethers.getSigners();

                  const requestNFTTxResponse = await RandomIpfsNFT.requestNFT({ value: mintFee.toString() });
                  const requestNFTTxReceipt = await requestNFTTxResponse.wait(1);

                  const requestId = await requestNFTTxReceipt.events[1].args.requestId;
                  const fulfillTxRes = await VRFCoordinatorV2Mock.fulfillRandomWords(requestId, RandomIpfsNFT.address);
                  await fulfillTxRes.wait(1);
              });

              it("\x1b[34mShould allow user to withdraw NFT Funds!\x1b[0m", async () => {
                  const getBalance = async () => {
                      const balance = await ethers.provider.getBalance(RandomIpfsNFT.address);
                      return balance.toString();
                  };

                  const balanceBeforeWithdrawal = await getBalance();

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

                  assert.equal(balanceBeforeWithdrawal.toString(), mintFee.toString());
                  assert.equal(balanceAfterWithdrawal.toString(), "0");
                  expect(parseInt(balanceBeforeWithdrawal)).greaterThan(parseInt(balanceAfterWithdrawal));
              });

              it("\x1b[34mShould allow multiple users to request NFT, Mint NFT and allow owner to withdraw NFT Funds!\x1b[0m", async () => {
                  const startingRequesterIndex = 1;
                  const additionalNFTRequesters = 5;

                  let latestRequestId;

                  for (let i = startingRequesterIndex; i < startingRequesterIndex + additionalNFTRequesters; i++) {
                      const additionalRequestersConnectedRandomIpfsNFT = await RandomIpfsNFT.connect(signers[i]);

                      const txResponse = await additionalRequestersConnectedRandomIpfsNFT.requestNFT({
                          value: mintFee.toString(),
                      });

                      const txReceipt = await txResponse.wait(1);
                      latestRequestId = txReceipt.events[1].args.requestId;
                  }

                  const fulfillTxResponse = await VRFCoordinatorV2Mock.fulfillRandomWords(
                      latestRequestId,
                      RandomIpfsNFT.address
                  );
                  const fulfillTxReceipt = await fulfillTxResponse.wait(1);

                  console.log(
                      "\x1b[32m%s\x1b[0m",
                      `NFT Minted with ${fulfillTxReceipt.confirmations} block confirmations!`
                  );

                  const getBalance = async () => {
                      const balance = await ethers.provider.getBalance(RandomIpfsNFT.address);
                      return balance.toString();
                  };

                  const balanceBeforeWithdrawal = await getBalance();

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
              });

              it("\x1b[34mShould be reverted if withdrawer is not the \x1b[36mOWNER \x1b[34mof NFT!\x1b[0m", async () => {
                  const attackerConnectRandomIpfsNFt = await RandomIpfsNFT.connect(signers[4]);

                  await expect(attackerConnectRandomIpfsNFt.withdraw()).to.be.revertedWith(
                      "Ownable: caller is not the owner"
                  );
              });
          });
      });

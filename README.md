# NFTs Hardhat Project

This Project Demonstrates Three NFTs, Frist - The BasicNFT, Second - The RandomIpfsNFT, and Third - The DynamicSvgNFT, All Three NFTs and This Project is Powered By Hardhat. This Project contains Deploy Scripts for each NFT, Unit Test for each NFT, Minting NFT Scripts and scripts for local environment as well as for testnet & mainnet Development.

# If You want to run this project on "GOERLI" testnet and don't know how to get Ready Your Project to work with "GOERLI TESTNET" and Having ETH fund/balance Issue. click <a href="https://github.com/theirrationalone/solidity-smart-contract-ethersjs/blob/main/README.md" target="blank">here</a>

<br />
<br />
<br />

## **SETTING ENVIRONMENT VARIABLES**

#### **Create a file .env and add keys given below with your credentials**

-   GOERLI_RPC_URL=your-rpc-from-alchemy-app

-   METAMASK_PRIVATE_KEY=your-metamask-private-key

-   COINMARKETCAP_API_KEY=your-coinmarketcap-api-key

-   ETHERSCAN_API_KEY=your-etherscan-api-key

-   UPLOAD_TO_PINATA=boolean-for-uploading-uris-to-pinata

-   PINATA_API_KEY=your-pinata-api-key

-   PINATA_API_SECRET=your-pinata-api-secret

<br />

if you don't have etherscan api key then Go [here](https://etherscan.io/register) and signup/login here. After signing up or logging in click on 'API KEYS' then click on 'Add' you would've your etherscan api key.

if you don't have coinmarketcap api key then Go [here](https://pro.coinmarketcap.com/signup) and signup/login here. After signing up or logging in you would've your coinmarketcap api key.

<br />
<br />
<hr>

## **RUNNING SCRIPTS**

# **Note**: <h1 style="color: yellow;">Follow Steps below if You are running your project on vs code otherwise open your <span style="color: blue; font-weight: bold; font-size: 48px;">terminal / shell / bash / cmd</span>, with admin privileges then go to your project's directory i.e. as on windows "C:/users/username/documents/your_project/" and then paste and run commands given below in sequence.</h1>

<br />
<br />
<br />

# Copy code below, Go to Your Project, Open Terminal then paste it into terminal.

```shell
npm install --force
```

<br />

# Try running some of the following tasks: ????????????

```shell
npx hardhat help
npx hardhat test
npx hardhat test --network goerli
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat node
npx hardhat run scripts/BasicNFT.js
npx hardhat run scripts/BasicNFT.js --network goerli
npx hardhat run scripts/RandomIpfsNFT.js
npx hardhat run scripts/RandomIpfsNFT.js --network goerli
npx hardhat run scripts/DynamicSvgNFT.js
npx hardhat run scripts/DynamicSvgNFT.js --network goerli
```

<br />

# **Note**: Try running commands below in sequence, Please run first command in a separate Terminal.

```shell
npx hardhat node
npx hardhat test --network localhost
npx hardhat run scripts/BasicNFT.js --network localhost
npx hardhat run scripts/RandomIpfsNFT.js  --network localhost
npx hardhat run scripts/DynamicSvgNFT.js  --network localhost
```

<br />

# Try running Command Given Below...

## <div style="color: purple; font-weight: bolder;">Shows all available command: </div>

```shell
npx hardhat
```

<br />
<br />


# Thank You! :) ?????????????
////////////////
/// LICENSE ///
//////////////
// SPDX-License-Identifier: MIT

/////////////////
/// COMPILER ///
///////////////
pragma solidity ^0.8.8;

////////////////
/// IMPORTS ///
//////////////
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///////////////
/// ERRORS ///
////////////
error RandomIpfsNFT__notPaidEnoughMintFee(uint256 minimumMintFee);
error RandomIpfsNFT__RangeOutOfBounds();
error RandomIpfsNFT__WithdrawalFailedUnexpectedly();

/**
 * @title DynamicNFT
 * @dev Dynamic NFT Contract, allows to mint Dynamic SVGs based on on-chain price feeds.
 * @param _vrfCoordinatorV2Address for Constructor
 * @param _gasLane for Constructor
 * @param _subscriptionId for Constructor
 * @param _callbackGasimit for Constructor
 * @param _mintFee for Constructor
 * @param _dogsUris for Constructor
 * @param _priceFeedAddress for Constructor
 * @param _lowSvg for Constructor
 * @param _highSvg for Constructor
 * @param title for ERC721 Constructor
 * @param symbol for ERC721 Constructor
 * @param _vrfCoordinatorV2Address for VRFConsumerBaseV2 Constructor
 * @author theirrationalone
 */

/////////////////
/// CONTRACT ///
///////////////
contract RandomIpfsNFT is ERC721URIStorage, VRFConsumerBaseV2, Ownable {
    ///////////////////////////
    /// TYPES DECLARATIONS ///
    /////////////////////////
    enum DogBreed {
        PUG,
        SHIBA_INU,
        ST_BERNARD
    }

    ////////////////////////
    /// STATE VARIABLES ///
    //////////////////////
    uint256 private s_tokenCounter;
    uint256 internal immutable i_mintFee;
    uint256 internal constant MAX_CHANCE = 100;

    mapping(uint256 => address) private s_requestIdToUriOwner;

    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    string[] internal s_dogsUris;

    VRFCoordinatorV2Interface internal immutable i_vrfCoordinatorV2;

    ///////////////
    /// EVENTS ///
    /////////////
    event NFTRequested(uint256 indexed requestId, address indexed NFTRequester);
    event NFTMinted(DogBreed indexed dogBreed, address indexed dogOwner, uint256 indexed tokenId);

    //////////////////////////
    /// SPECIAL FUNCTIONS ///
    ////////////////////////
    constructor(
        address _vrfCoordinatorV2Address,
        bytes32 _gasLane,
        uint64 _subscriptionId,
        uint32 _callbackGasimit,
        uint256 _mintFee,
        string[3] memory _dogsUris
    ) ERC721("RANDOM IPFS NFT", "RIN") VRFConsumerBaseV2(_vrfCoordinatorV2Address) {
        i_vrfCoordinatorV2 = VRFCoordinatorV2Interface(_vrfCoordinatorV2Address);
        i_gasLane = _gasLane;
        i_subscriptionId = _subscriptionId;
        i_callbackGasLimit = _callbackGasimit;
        s_tokenCounter = 0;
        i_mintFee = _mintFee;
        s_dogsUris = _dogsUris;
    }

    /////////////////////////////
    /// MUTATIONAL FUNCTIONS ///
    ///////////////////////////
    function requestNFT() public payable returns (uint256 requestId) {
        if (msg.value < i_mintFee) {
            revert RandomIpfsNFT__notPaidEnoughMintFee(i_mintFee);
        }

        requestId = i_vrfCoordinatorV2.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_requestIdToUriOwner[requestId] = msg.sender;

        emit NFTRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address dogOwner = s_requestIdToUriOwner[requestId];
        uint256 moddedRng = randomWords[0] % MAX_CHANCE;
        uint256 newTokenId = s_tokenCounter;

        DogBreed breed = getDogBreedFromModdedRng(moddedRng);

        _safeMint(dogOwner, newTokenId);
        _setTokenURI(newTokenId, s_dogsUris[uint256(breed)]);
        s_tokenCounter += 1;

        emit NFTMinted(breed, dogOwner, newTokenId);
    }

    function withdraw() public onlyOwner {
        (bool isSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");

        if (!isSuccess) {
            revert RandomIpfsNFT__WithdrawalFailedUnexpectedly();
        }
    }

    function getDogBreedFromModdedRng(uint256 _moddedRng) internal pure returns (DogBreed) {
        uint256 cumulativeSum = 0;

        uint256[3] memory chanceArray = getChanceArray();

        for (uint256 i = cumulativeSum; i < chanceArray.length; i++) {
            if (_moddedRng >= cumulativeSum && _moddedRng < cumulativeSum + chanceArray[i]) {
                return DogBreed(i);
            }
            cumulativeSum += chanceArray[i];
        }

        revert RandomIpfsNFT__RangeOutOfBounds();
    }

    function getChanceArray() internal pure returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE];
    }

    /////////////////////////
    /// HELPER FUNCTIONS ///
    ///////////////////////
    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getMaxChance() public pure returns (uint256) {
        return MAX_CHANCE;
    }

    function getDogUriOwnerFromRequestId(uint256 _requestId) public view returns (address) {
        return s_requestIdToUriOwner[_requestId];
    }

    function getGasLane() public view returns (bytes32) {
        return i_gasLane;
    }

    function getSubscriptionId() public view returns (uint64) {
        return i_subscriptionId;
    }

    function getCallbackGasLimit() public view returns (uint32) {
        return i_callbackGasLimit;
    }

    function getRequestConfirmations() public pure returns (uint16) {
        return REQUEST_CONFIRMATIONS;
    }

    function getNumWords() public pure returns (uint32) {
        return NUM_WORDS;
    }

    function getDogsUri(uint256 _uriIdx) public view returns (string memory) {
        return s_dogsUris[_uriIdx];
    }

    function getDogsUriLength() public view returns (uint256) {
        return s_dogsUris.length;
    }

    function getVRFCoordinatorV2Address() public view returns (VRFCoordinatorV2Interface) {
        return i_vrfCoordinatorV2;
    }
}

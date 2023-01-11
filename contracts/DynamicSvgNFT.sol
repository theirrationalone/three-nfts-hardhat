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
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";

///////////////
/// ERRORS ///
////////////
error DynamicSvgNFT__nonexistentTokenUriQuery(uint256 tokenId);

/**
 * @title DynamicNFT
 * @dev Dynamic NFT Contract, allows to mint Dynamic SVGs based on on-chain price feeds.
 * @param _priceFeedAddress for Constructor
 * @param _lowSvg for Constructor
 * @param _highSvg for Constructor
 * @param title for ERC721 Constructor
 * @param symbol for ERC721 Constructor
 * @author theirrationalone
 */

/////////////////
/// CONTRACT ///
///////////////
contract DynamicSvgNFT is ERC721 {
    ////////////////////////
    /// STATE VARIABLES ///
    //////////////////////
    uint256 private s_tokenCounter;

    string internal i_lowSvg;
    string internal i_highSvg;
    string private constant BASE64_ENCODED_SVG_PREFIX = "data:image/svg+xml;base64,";
    string private constant BASE64_ENCODED_JSON_PREFIX = "data:application/json;base64,";
    mapping(uint256 => uint256) private s_tokenIdToHighValue;

    AggregatorV3Interface private immutable i_priceFeed;

    ///////////////
    /// EVENTS ///
    /////////////
    event NFTMinted(address indexed minter, uint256 indexed tokenId, uint256 indexed highValue);

    //////////////////////////
    /// SPECIAL FUNCTIONS ///
    ////////////////////////
    constructor(
        address _priceFeedAddress,
        string memory _lowSvg,
        string memory _highSvg
    ) ERC721("Dynamic SVG NFT", "DSN") {
        i_priceFeed = AggregatorV3Interface(_priceFeedAddress);
        s_tokenCounter = 0;
        i_lowSvg = svgToImageUri(_lowSvg);
        i_highSvg = svgToImageUri(_highSvg);
    }

    /////////////////////////////
    /// MUTATIONAL FUNCTIONS ///
    ///////////////////////////
    function svgToImageUri(string memory _svg) internal pure returns (string memory) {
        string memory svgUriEncoded = Base64.encode(bytes(string(abi.encodePacked(_svg))));
        return string(abi.encodePacked(BASE64_ENCODED_SVG_PREFIX, svgUriEncoded));
    }

    function mintNFT(uint256 _highValue) public {
        s_tokenIdToHighValue[s_tokenCounter] = _highValue;
        _safeMint(msg.sender, s_tokenCounter);
        emit NFTMinted(msg.sender, s_tokenCounter, _highValue);
        s_tokenCounter += 1;
    }

    function _baseURI() internal pure override returns (string memory) {
        return BASE64_ENCODED_JSON_PREFIX;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) {
            revert DynamicSvgNFT__nonexistentTokenUriQuery(tokenId);
        }

        string memory imageUri = i_lowSvg;

        (, int256 latestPrice, , , ) = i_priceFeed.latestRoundData();

        if (uint256(latestPrice) >= s_tokenIdToHighValue[tokenId]) {
            imageUri = i_highSvg;
        }

        bytes memory jsonUri = bytes(
            abi.encodePacked(
                '{"name":"',
                name(),
                '", "description": "An NFT that changes based on chainlink price feeds!", "image": "',
                imageUri,
                '", "attributes": [{"trait_type": "Cuteness", "value": 100}]}'
            )
        );

        return string(abi.encodePacked(_baseURI(), Base64.encode(jsonUri)));
    }

    /////////////////////////
    /// HELPER FUNCTIONS ///
    ///////////////////////
    function getCurrentTokenId() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getLowSvg() public view returns (string memory) {
        return i_lowSvg;
    }

    function getHighSvg() public view returns (string memory) {
        return i_highSvg;
    }

    function getBase64EncodedSvgPrefix() public pure returns (string memory) {
        return BASE64_ENCODED_SVG_PREFIX;
    }

    function getBase64EncodedJsonPrefix() public pure returns (string memory) {
        return BASE64_ENCODED_JSON_PREFIX;
    }

    function getMappedHighValueToTokenId(uint256 tokenId) public view returns (uint256) {
        return s_tokenIdToHighValue[tokenId];
    }

    function getPriceFeedAddress() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }
}

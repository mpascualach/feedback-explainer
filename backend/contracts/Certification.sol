// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// this is a platform that would certify any certifications being passed through here as NFTs
contract Certification is ERC721, Ownable {
    // set latestToken to 0 at first - ready to increment with each mint
    uint256 private latestTokenId = 0;

    // map token ids with issue date - is useful for storage purposes
    mapping(uint256 => uint256) public tokenIssueDate;

    // construct Certification contract
    constructor() ERC721("Certification", "CERT") {}

    // this function initiates the minting process
    function mintCertification(
        address awardee,
        uint256 issueDate,
        string memory issuerName
    ) external onlyOwner {
        latestTokenId++; // increment token
        uint256 tokenId = latestTokenId; // current latestTokenId;

        // use ERC721's minting protocol
        _mint(awardee, tokenId);

        // create new entry in tokenIssueDate mini-ledger
        tokenIssueDate[tokenId] = issueDate;

        // notify blockchain that a certification has been minted
        emit CertificationMinted(tokenId, awardee, issueDate, issuerName);
    }

    // declare event to be triggered when certification is minted
    event CertificationMinted(
        uint256 tokenId,
        address awardee,
        uint256 issueDate,
        string issuerName
    );
}

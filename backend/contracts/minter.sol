// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Certification is ERC721, Ownable {
    uint256 private latestTokenId = 0;

    mapping(uint256 => uint256) public tokenIssueDate;

    constructor() ERC721("Certification", "CERT") {}

    function mintCertification(
        address awardee,
        string memory issuerName
    ) external onlyOwner {
        latestTokenId++;
        uint256 tokenId = latestTokenId;

        _mint(awardee, tokenId);

        uint256 issueDate = block.timestamp; // get current timestamp as issue date

        tokenIssueDate[tokenId] = issueDate;

        //communicate that an event has been certified
        emit CertificationMinted(tokenId, awardee, issueDate, issuerName);
    }

    event CertificationMinted(
        uint256 tokenId,
        address awardee,
        uint256 issueDate,
        string issuerName
    );
}

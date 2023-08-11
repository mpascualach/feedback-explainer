// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// this is a platform that would certify any certifications being passed through here as NFTs
contract Certification is ERC721, Ownable {
    uint256 private latestTokenId = 0;
    mapping(uint256 => uint256) public tokenIssueDate;

    struct CertificationMetadata {
        string title;
        string description;
        string imageURI;
        address awardee;
        uint256 issueDate;
    }
    mapping(uint256 => CertificationMetadata) public certificationMetadata;

    constructor() ERC721("Certification", "CERT") {}

    function mintCertification(
        string memory title,
        string memory description,
        string memory imageURI
    ) external onlyOwner {
        latestTokenId++;
        uint256 tokenId = latestTokenId;

        _mint(msg.sender, tokenId);

        uint256 issueDate = block.timestamp;
        tokenIssueDate[tokenId] = issueDate;

        certificationMetadata[tokenId] = CertificationMetadata({
            title: title,
            description: description,
            imageURI: imageURI,
            awardee: msg.sender,
            issueDate: issueDate
        });

        emit CertificationMinted(tokenId, msg.sender, issueDate);
    }

    function getLatestTokenId() external view returns (uint256) {
        return latestTokenId;
    }

    event CertificationMinted(
        uint256 tokenId,
        address awardee,
        uint256 issueDate
    );
}

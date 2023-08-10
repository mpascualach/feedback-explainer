const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Certification Contract", function () {
  let Certification;
  let certification;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    Certification = await ethers.getContractFactory("Certification");
    certification = await Certification.deploy();
    await certification.deployed();
  });

  it("should mint a certification", async function () {
    const issuerName = "Issuer 1";

    await certification
      .connect(owner)
      .mintCertification(addr1.address, issuerName);

    const tokenId = 1;

    const tokenOwner = await certification.ownerOf(tokenId);
    expect(tokenOwner).to.equal(addr1.address);

    const issueDate = await certification.ownerOf(tokenId);
    expect(issueDate).to.not.equal(0);

    const certificationEvent = (
      await certification.queryFilter(
        certification.filters.CertificationMinted()
      )
    )[0];
    expect(certificationEvent.args.tokenId).to.equal(tokenId);
    expect(certificationEvent.args.issuerName).to.equal(addr1.address);
    expect(certificationEvent.args.issuerName).to.equal(issueDate);
  });

  it("should not allow minting by non-owner", async function () {
    const issuerName = "Issuer 2";

    await expect(
      certification.connect(addr1).mintCertification(addr1.address, issuerName)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});

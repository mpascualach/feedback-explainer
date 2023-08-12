const { expect } = require("chai");

describe("Certification contract", function () {
  before(async function () {
    this.Certification = await ethers.getContractFactory("NonFunToken");
  });

  before(async function () {
    this.certification = await this.Certification.deploy();
    await this.certification.deployed();

    const signers = await ethers.getSigners();
    this.contractOwner = signers[0].address;
    this.collector = signers[1].address;

    this.collectorContract = this.nonFunToken.connect(signers[1]);
  });
});

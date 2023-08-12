const Certification_ERC721 = artifacts.require("Certification_ERC721");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Certification_ERC721", function (/* accounts */) {
  it("should assert true", async function () {
    await Certification_ERC721.deployed();
    return assert.isTrue(true);
  });
});

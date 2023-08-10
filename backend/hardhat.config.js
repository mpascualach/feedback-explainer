/** @type import('hardhat/config').HardhatUserConfig */
const fs = require("fs-extra");
const path = require("path");

require("hardhat-gas-reporter");

task("compile-with-abi-move", "Compile contracts with abi move").setAction(
  async () => {
    await run("compile");

    const artifactsPath = path.join(
      __dirname,
      "../backend/artifacts/build-info"
    );
    const abiFiles = fs
      .readdirSync(artifactsPath)
      .filter((file) => file.endsWith(".json"));

    if (abiFiles.length == 0) {
      console.log("No ABI files found");
      return;
    }

    const abiFileName = abiFiles[0];
    const abiPath = path.join(artifactsPath, abiFileName);
    const targetPath = path.join(__dirname, "../frontend/src/abi.json");

    await fs.copy(abiPath, targetPath);

    console.log(
      `ABI file '${abiFileName}' moved to frontend/utils/ as Certification.json`
    );
  }
);

module.exports = {
  networks: {
    hardhat: {},
    localhost: {},
  },
  solidity: "0.8.19",
  tasks: {
    "compile-with-abi-move": {},
  },
};

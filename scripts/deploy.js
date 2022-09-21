// Imports
const { ethers, run, network } = require("hardhat")

// Main
const main = async () => {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying contract...")
  const simpleStorage = await SimpleStorageFactory.deploy()
  await simpleStorage.deployed()

  console.log(`Deployed contract to: ${simpleStorage.address}`)

  // When deployed to hardhat network
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    // Wait a few blocks before verifying
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }
}

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified")
    } else {
      console.log(e)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

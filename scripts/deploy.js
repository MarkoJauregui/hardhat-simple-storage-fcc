// Imports
const { ethers, run, network } = require("hardhat")

// Main
const main = async () => {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )

    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()

    console.log(`Deployed contract to: ${simpleStorage.address}`)

    // When deployed to Goerli network
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        // Wait a few blocks before verifying
        console.log("Waiting for txs...")
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`Current value: ${currentValue}`)

    // Update the current value
    const transactionResponse = await simpleStorage.store(3)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value: ${updatedValue}`)
}

const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")

    // Try/Catch to make sure contract is not already verified
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

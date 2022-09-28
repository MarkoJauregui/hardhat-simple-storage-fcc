const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("SimpleStorage", () => {
    let simpleStorageFactory, simpleStorage

    beforeEach(async () => {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should Start with a favorite number of 0", async () => {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Should update when we call store", async () => {
        const expectedValue = "3"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)

        const currentValue = await simpleStorage.retrieve()
        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Should update when we call addPerson", async () => {
        const expectedName = "Marko"
        const expectedValue = "3"
        const transactionResponse = await simpleStorage.addPerson(
            expectedName,
            expectedValue
        )
        await transactionResponse.wait(1)

        const currentValue = await simpleStorage.people(0)
        expect(currentValue.name).to.equal(expectedName)
        expect(currentValue.favoriteNumber).to.equal(expectedValue)
    })
})

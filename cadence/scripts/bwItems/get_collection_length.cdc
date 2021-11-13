import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import BWItems from "../../contracts/BWItems.cdc"

// This script returns the size of an account's BWItems collection.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account.getCapability(BWItems.CollectionPublicPath)!
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}

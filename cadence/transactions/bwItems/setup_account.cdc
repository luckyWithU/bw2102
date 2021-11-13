import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import BWItems from "../../contracts/BWItems.cdc"

// This transaction configures an account to hold BW Items.
transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&BWItems.Collection>(from: BWItems.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- BWItems.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: BWItems.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&BWItems.Collection{NonFungibleToken.CollectionPublic, BWItems.BWItemsCollectionPublic}>(BWItems.CollectionPublicPath, target: BWItems.CollectionStoragePath)
        }
    }
}

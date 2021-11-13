import NonFungibleToken from "./NonFungibleToken.cdc"

pub contract BWItems: NonFungibleToken {

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Minted(id: UInt64, typeID: UInt64, metadata: {String : String})

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    // totalSupply
    pub var totalSupply: UInt64

    // NFT
    pub resource NFT: NonFungibleToken.INFT {
        // The token's ID
        pub let id: UInt64
        pub let typeID: UInt64

        pub let metadata: {String : String}

        init(initID: UInt64, initTypeID: UInt64, initMetadata: {String : String}) {
            self.id = initID
            self.typeID = initTypeID
            self.metadata = initMetadata
        }
    }

    pub resource interface BWItemsCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowBWItem(id: UInt64): &BWItems.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow BWItem reference: The ID of the returned reference is incorrect"
            }
        }
    }

    // Collection
    pub resource Collection: BWItemsCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {

        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        // withdraw
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @BWItems.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        // borrowBWItem
        pub fun borrowBWItem(id: UInt64): &BWItems.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &BWItems.NFT
            } else {
                return nil
            }
        }

        destroy() {
            destroy self.ownedNFTs
        }

        init () {
            self.ownedNFTs <- {}
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

	pub resource NFTMinter {

		pub fun mintNFT(recipient: &{NonFungibleToken.CollectionPublic}, typeID: UInt64, metadata: {String : String}) {
            emit Minted(id: BWItems.totalSupply, typeID: typeID, metadata: metadata)

			// deposit it in the recipient's account using their reference
			recipient.deposit(token: <-create BWItems.NFT(initID: BWItems.totalSupply, initTypeID: typeID, initMetadata: metadata))

            BWItems.totalSupply = BWItems.totalSupply + (1 as UInt64)
		}
	}

    // fetch
    // Get a reference to a BWItem from an account's Collection, if available.
    // If an account does not have a BWItems.Collection, panic.
    // If it has a collection but does not contain the itemID, return nil.
    // If it has a collection and that collection contains the itemID, return a reference to that.
    pub fun fetch(_ from: Address, itemID: UInt64): &BWItems.NFT? {
        let collection = getAccount(from)
            .getCapability(BWItems.CollectionPublicPath)!
            .borrow<&BWItems.Collection{BWItems.BWItemsCollectionPublic}>()
            ?? panic("Couldn't get collection")
        // We trust BWItems.Collection.borowBWItem to get the correct itemID
        // (it checks it before returning it).
        return collection.borrowBWItem(id: itemID)
    }

	init() {
        
        self.CollectionStoragePath = /storage/bwItemsCollection
        self.CollectionPublicPath = /public/bwItemsCollection
        self.MinterStoragePath = /storage/bwItemsMinter

        self.totalSupply = 0

        let minter <- create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)

        emit ContractInitialized()
	}
}

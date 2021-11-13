import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import BWToken from "../../contracts/BWToken.cdc"
import BWItems from "../../contracts/BWItems.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

    let bwtokenReceiver: Capability<&BWToken.Vault{FungibleToken.Receiver}>
    let bwItemsProvider: Capability<&BWItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(account: AuthAccount) {
        // We need a provider capability, but one is not provided by default so we create one if needed.
        let bwItemsCollectionProviderPrivatePath = /private/bwItemsCollectionProvider

        self.bwtokenReceiver = account.getCapability<&BWToken.Vault{FungibleToken.Receiver}>(BWToken.ReceiverPublicPath)!
        
        assert(self.bwtokenReceiver.borrow() != nil, message: "Missing or mis-typed BWToken receiver")

        if !account.getCapability<&BWItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(bwItemsCollectionProviderPrivatePath)!.check() {
            account.link<&BWItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(bwItemsCollectionProviderPrivatePath, target: BWItems.CollectionStoragePath)
        }

        self.bwItemsProvider = account.getCapability<&BWItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(bwItemsCollectionProviderPrivatePath)!
        assert(self.bwItemsProvider.borrow() != nil, message: "Missing or mis-typed BWItems.Collection provider")

        self.storefront = account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")
    }

    execute {
        let saleCut = NFTStorefront.SaleCut(
            receiver: self.bwtokenReceiver,
            amount: saleItemPrice
        )
        self.storefront.createSaleOffer(
            nftProviderCapability: self.bwItemsProvider,
            nftType: Type<@BWItems.NFT>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<@BWToken.Vault>(),
            saleCuts: [saleCut]
        )
    }
}

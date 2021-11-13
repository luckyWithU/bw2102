import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import BWToken from "../../contracts/BWToken.cdc"
import BWItems from "../../contracts/BWItems.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"

transaction(saleOfferResourceID: UInt64, storefrontAddress: Address) {

    let paymentVault: @FungibleToken.Vault
    let bwItemsCollection: &BWItems.Collection{NonFungibleToken.Receiver}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let saleOffer: &NFTStorefront.SaleOffer{NFTStorefront.SaleOfferPublic}

    prepare(account: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Cannot borrow Storefront from provided address")

        self.saleOffer = self.storefront.borrowSaleOffer(saleOfferResourceID: saleOfferResourceID)
            ?? panic("No offer with that ID in Storefront")
        
        let price = self.saleOffer.getDetails().salePrice

        let mainBWTokenVault = account.borrow<&BWToken.Vault>(from: BWToken.VaultStoragePath)
            ?? panic("Cannot borrow BWToken vault from account storage")
        
        self.paymentVault <- mainBWTokenVault.withdraw(amount: price)

        self.bwItemsCollection = account.borrow<&BWItems.Collection{NonFungibleToken.Receiver}>(
            from: BWItems.CollectionStoragePath
        ) ?? panic("Cannot borrow BWItems collection receiver from account")
    }

    execute {
        let item <- self.saleOffer.accept(
            payment: <-self.paymentVault
        )

        self.bwItemsCollection.deposit(token: <-item)

        self.storefront.cleanup(saleOfferResourceID: saleOfferResourceID)
    }
}

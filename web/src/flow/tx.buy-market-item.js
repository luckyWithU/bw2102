import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {tx} from "./util/tx"
import {invariant} from "@onflow/util-invariant"

const CODE = fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import FUSD from 0xFUSD
  import BWItems from 0xBWItems
  import NFTStorefront from 0xNFTStorefront

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
        ?? panic("Could not borrow Storefront from provided address")

      self.saleOffer = self.storefront.borrowSaleOffer(saleOfferResourceID: saleOfferResourceID)
        ?? panic("No Offer with that ID in Storefront")
      
      let price = self.saleOffer.getDetails().salePrice

      let mainFUSDVault = account.borrow<&FUSD.Vault>(from: /storage/fusdVault)
        ?? panic("Cannot borrow BWToken vault from account storage")
      
      self.paymentVault <- mainFUSDVault.withdraw(amount: price)

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
`

// prettier-ignore
export function buyMarketItem({itemID, ownerAddress}, opts = {}) {
  invariant(itemID != null, "buyMarketItem({itemID, ownerAddress}) -- itemID required")
  invariant(ownerAddress != null, "buyMarketItem({itemID, ownerAddress}) -- ownerAddress required")

  return tx([
    fcl.transaction(CODE),
    fcl.args([
      fcl.arg(Number(itemID), t.UInt64),
      fcl.arg(String(ownerAddress), t.Address),
    ]),
    fcl.proposer(fcl.authz),
    fcl.payer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(1000),
  ], opts)
}

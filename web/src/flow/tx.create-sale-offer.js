import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {tx} from "./util/tx"

const CODE = fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import FUSD from 0xFUSD
  import BWItems from 0xBWItems
  import NFTStorefront from 0xNFTStorefront

  transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

    let fusdReceiver: Capability<&FUSD.Vault{FungibleToken.Receiver}>
    let bwItemsCollection: Capability<&BWItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(account: AuthAccount) {
      // We need a provider capability, but one is not provided by default so we create one if needed.
      let bwItemsCollectionProviderPrivatePath = /private/bwItemsCollectionProvider

      self.fusdReceiver = account.getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)!

      assert(self.fusdReceiver.borrow() != nil, message: "Missing or mis-typed FUSD receiver")

      if !account.getCapability<&BWItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(bwItemsCollectionProviderPrivatePath)!.check() {
        account.link<&BWItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(bwItemsCollectionProviderPrivatePath, target: BWItems.CollectionStoragePath)
      }

      self.bwItemsCollection = account.getCapability<&BWItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(bwItemsCollectionProviderPrivatePath)!
      assert(self.bwItemsCollection.borrow() != nil, message: "Missing or mis-typed BWItemsCollection provider")
      
      self.storefront = account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
        ?? panic("Missing or mis-typed NFTStorefront Storefront")
    }

    execute {
      let saleCut = NFTStorefront.SaleCut(
        receiver: self.fusdReceiver,
        amount: saleItemPrice
      )

      self.storefront.createSaleOffer(
        nftProviderCapability: self.bwItemsCollection,
        nftType: Type<@BWItems.NFT>(),
        nftID: saleItemID,
        salePaymentVaultType: Type<@FUSD.Vault>(),
        saleCuts: [saleCut]
      )
    }
  }

`

export function createSaleOffer({itemID, price}, opts = {}) {
  if (itemID == null)
    throw new Error("createSaleOffer(itemID, price) -- itemID required")
  if (price == null)
    throw new Error("createSaleOffer(itemID, price) -- price required")

  // prettier-ignore
  return tx([
    fcl.transaction(CODE),
    fcl.args([
      fcl.arg(Number(itemID), t.UInt64),
      fcl.arg(String(price), t.UFix64),
    ]),
    fcl.proposer(fcl.authz),
    fcl.payer(fcl.authz),
    fcl.authorizations([
      fcl.authz
    ]),
    fcl.limit(1000)
  ], opts)
}

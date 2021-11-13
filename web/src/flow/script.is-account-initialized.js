import {send, decode, script, args, arg, cdc} from "@onflow/fcl"
import {Address} from "@onflow/types"

const CODE = cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import FUSD from 0xFUSD
  import BWItems from 0xBWItems
  import NFTStorefront from 0xNFTStorefront

  pub fun hasFUSD(_ address: Address): Bool {
    let receiver: Bool = getAccount(address)
      .getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)
      .check()

    let balance: Bool = getAccount(address)
      .getCapability<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance)
      .check()

    return receiver && balance
  }

  pub fun hasItems(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&BWItems.Collection{NonFungibleToken.CollectionPublic, BWItems.BWItemsCollectionPublic}>(BWItems.CollectionPublicPath)
      .check()
  }

  pub fun hasStorefront(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath)
      .check()
  }

  pub fun main(address: Address): {String: Bool} {
    let ret: {String: Bool} = {}
    ret["FUSD"] = hasFUSD(address)
    ret["BWItems"] = hasItems(address)
    ret["BWItemsMarket"] = hasStorefront(address)
    return ret
  }
`

export function isAccountInitialized(address) {
  if (address == null) return Promise.resolve(false)

  // prettier-ignore
  return send([
    script(CODE),
    args([
      arg(address, Address)
    ])
  ]).then(decode)
}

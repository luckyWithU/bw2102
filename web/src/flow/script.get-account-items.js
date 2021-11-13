import * as fcl from "@onflow/fcl"
import {Address} from "@onflow/types"

const CODE = fcl.cdc`
  import NonFungibleToken from 0xNonFungibleToken
  import BWItems from 0xBWItems

  pub fun main(address: Address): [UInt64] {
    if let collection =  getAccount(address).getCapability<&BWItems.Collection{NonFungibleToken.CollectionPublic, BWItems.BWItemsCollectionPublic}>(BWItems.CollectionPublicPath).borrow() {
      return collection.getIDs()
    }

    return []
  }
`

export function fetchAccountItems(address) {
  if (address == null) return Promise.resolve([])
  // prettier-ignore
  return fcl.send([
    fcl.script(CODE),
    fcl.args([
      fcl.arg(address, Address)
    ]),
  ]).then(fcl.decode).then(d => d.sort((a, b) => a - b))
}

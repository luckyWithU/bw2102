import BWToken from "../../contracts/BWToken.cdc"
import FungibleToken from "../../contracts/FungibleToken.cdc"

// This script returns an account's BWToken balance.

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    
    let vaultRef = account.getCapability(BWToken.BalancePublicPath)!.borrow<&BWToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}

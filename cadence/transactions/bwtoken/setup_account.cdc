import FungibleToken from "../../contracts/FungibleToken.cdc"
import BWToken from "../../contracts/BWToken.cdc"

// This transaction is a template for a transaction
// to add a Vault resource to their account
// so that they can use the BWToken

transaction {

    prepare(signer: AuthAccount) {

        if signer.borrow<&BWToken.Vault>(from: BWToken.VaultStoragePath) == nil {
            // Create a new BWToken Vault and put it in storage
            signer.save(<-BWToken.createEmptyVault(), to: BWToken.VaultStoragePath)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&BWToken.Vault{FungibleToken.Receiver}>(
                BWToken.ReceiverPublicPath,
                target: BWToken.VaultStoragePath
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&BWToken.Vault{FungibleToken.Balance}>(
                BWToken.BalancePublicPath,
                target: BWToken.VaultStoragePath
            )
        }
    }
}

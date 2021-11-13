import FungibleToken from "./FungibleToken.cdc"

pub contract BWToken: FungibleToken {
    // The event that is emitted when the contract is created
    pub event TokensInitialized(initialSupply: UFix64)

    // The event that is emitted when tokens are withdrawn from a Vault
    pub event TokensWithdrawn(amount: UFix64, from: Address?)

    // The event that is emitted when tokens are deposited to a Vault
    pub event TokensDeposited(amount: UFix64, to: Address?)

    // The event that is emitted when new tokens are minted
    pub event TokensMinted(amount: UFix64)

    // The event that is emitted when tokens are destroyed
    pub event TokensBurned(amount: UFix64)

    // The event that is emitted when a new minter resource is created
    pub event MinterCreated(allowedAmount: UFix64)

    pub let VaultStoragePath: StoragePath
    pub let ReceiverPublicPath: PublicPath
    pub let BalancePublicPath: PublicPath
    pub let AdminStoragePath: StoragePath

    pub var totalSupply: UFix64

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {

        pub var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }

        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @BWToken.Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            vault.balance = 0.0
            destroy vault
        }

        destroy() {
            BWToken.totalSupply = BWToken.totalSupply - self.balance
            if(self.balance > 0.0) {
                emit TokensBurned(amount: self.balance)
            }
        }
    }

    pub fun createEmptyVault(): @Vault {
        return <-create Vault(balance: 0.0)
    }

    pub resource Administrator {

        pub fun createNewMinter(allowedAmount: UFix64): @Minter {
            emit MinterCreated(allowedAmount: allowedAmount)
            return <-create Minter(allowedAmount: allowedAmount)
        }
    }

    pub resource Minter {

        // The amount of tokens that the minter is allowed to mint
        pub var allowedAmount: UFix64

        // mintTokens
        //
        // Function that mints new tokens, adds them to the total supply,
        // and returns them to the calling context.
        //
        pub fun mintTokens(amount: UFix64): @BWToken.Vault {
            pre {
                amount > 0.0: "Amount minted must be greater than zero"
                amount <= self.allowedAmount: "Amount minted must be less than the allowed amount"
            }
            BWToken.totalSupply = BWToken.totalSupply + amount
            self.allowedAmount = self.allowedAmount - amount
            emit TokensMinted(amount: amount)
            return <-create Vault(balance: amount)
        }

        init(allowedAmount: UFix64) {
            self.allowedAmount = allowedAmount
        }
    }

    init() {
        // Set our named paths.
        //FIXME: REMOVE SUFFIX BEFORE RELEASE
        self.VaultStoragePath = /storage/bwtokenVault002
        self.ReceiverPublicPath = /public/bwtokenReceiver002
        self.BalancePublicPath = /public/bwtokenBalance002
        self.AdminStoragePath = /storage/bwtokenAdmin002

        // Initialize contract state.
        self.totalSupply = 0.0

        // Create the one true Admin object and deposit it into the conttract account.
        let admin <- create Administrator()
        self.account.save(<-admin, to: self.AdminStoragePath)

        // Emit an event that shows that the contract was initialized.
        emit TokensInitialized(initialSupply: self.totalSupply)
    }
}

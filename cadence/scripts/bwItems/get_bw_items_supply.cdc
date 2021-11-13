import BWItems from "../../contracts/BWItems.cdc"

// This scripts returns the number of BWItems currently in existence.

pub fun main(): UInt64 {    
    return BWItems.totalSupply
}

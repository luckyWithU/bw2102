import BWToken from "../../contracts/BWToken.cdc"

// This script returns the total amount of BWToken currently in existence.

pub fun main(): UFix64 {

    let supply = BWToken.totalSupply

    log(supply)

    return supply
}

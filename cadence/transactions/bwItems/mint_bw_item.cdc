import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import BWItems from "../../contracts/BWItems.cdc"

transaction(recipient: Address, typeID: UInt64, name: String, color: String, imageUrl: String, info: String, quantity: String, series: String) {
    
    let minter: &BWItems.NFTMinter

    prepare(signer: AuthAccount) {

        self.minter = signer.borrow<&BWItems.NFTMinter>(from: BWItems.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
  
        let recipient = getAccount(recipient)
        let metadata : {String : String} = {
            "name": name,
            "color": color,
            "imageUrl": imageUrl,
            "info": info,
            "quantity": quantity,
            "series": series
        }

        let receiver = recipient
            .getCapability(BWItems.CollectionPublicPath)!
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        self.minter.mintNFT(recipient: receiver, typeID: typeID, metadata: metadata)
    }
}

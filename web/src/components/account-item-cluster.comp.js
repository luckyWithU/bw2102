import React, {useEffect, useState, Suspense} from "react"
import {useAccountItem} from "../hooks/use-account-item.hook"
import {useMarketItem} from "../hooks/use-market-item.hook"
//import {useCurrentUser} from "../hooks/use-current-user.hook"
import {IDLE} from "../global/constants"
import {
  Button,
  Spinner,
  Text,
  Image,
  HStack,
} from "@chakra-ui/react"
import { Card, Row, Col } from "react-bootstrap"

export const ItemImage = ({typeID}) => {
  // Lazy load SVG images for the bw items.
  let [item] = useState("")

  useEffect(() => {
    async function getImage() {
      //let importedIcon = await import(`../svg/Items/item0${typeID}.svg`)
      //setItemImage(importedIcon.default)
    }
    if (typeID) getImage()
  }, [typeID])

  return <Image maxW="64px" src={item} />
}

export function AccountItemCluster({address, id}) {
  const item = useAccountItem(address, id)
  const listing = useMarketItem(address, id)
  //const [cu] = useCurrentUser()

  const BUSY = item.status !== IDLE || listing.status !== IDLE

  if (address == null) return null
  if (id == null) return null
  return (
    <Card key={item.name} border="dark" className="mb-2 bg-grey">
        <Card.Body>
            <Row>
                <Col xs={3}><Image src={item.metadata.imageUrl} rounded fluid="true" /></Col>
                <Col xs={6}>
                    <div className="mb-2">Name: {item.metadata.name}</div>
                    <div className="mb-2">Color: {item.metadata.color}</div>      
                    <div className="mb-2">Available: only {item.metadata.quantity} listing</div>
                </Col>
                
                {!item.forSale ? (
                  <Col xs={3} className="list-btn">
                    <Button
                      colorScheme="blue"
                      size="sm"
                      disabled={BUSY}
                      onClick={() => item.sell("1.0")}
                    >
                      <HStack>
                        {BUSY && <Spinner mr="2" size="xs" />}{" "}
                        <Text>Publish</Text>
                      </HStack>
                    </Button>
                  </Col>
                ) : (
                  <Col xs={3} className="list-btn">
                    <Button
                      size="sm"
                      colorScheme="orange"
                      disabled={BUSY}
                      onClick={listing.cancelListing}
                    >
                      <HStack>
                        {BUSY && <Spinner mr="2" size="xs" />} <Text>UnPublish</Text>
                      </HStack>
                    </Button>
                  </Col>
                )}
            </Row>
        </Card.Body>
    </Card>
  )
}

export default function WrappedAccountItemCluster(props) {
  return (
    <Suspense
      fallback={
        <Card border="dark" className="mb-2 bg-grey">
          <Card.Body>
          </Card.Body>
        </Card>
      }
    >
      <AccountItemCluster {...props} />
    </Suspense>
  )
}

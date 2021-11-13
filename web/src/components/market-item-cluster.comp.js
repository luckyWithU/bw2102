import {Suspense} from "react"
import {useMarketItem} from "../hooks/use-market-item.hook"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import {IDLE} from "../global/constants"
import {
  Button,
  Spinner,
  Text,
  HStack,
} from "@chakra-ui/react"
import {Row, Col, Card, Image } from "react-bootstrap"

import PurchaseDialog from "./purchase-dialog.comp"
//import {ItemImage} from "./account-item-cluster.comp"

export function MarketItemCluster({address, id}) {
  const [cu, loggedIn] = useCurrentUser()
  const item = useMarketItem(address, id)

  const BUSY = item.status !== IDLE || item.status !== IDLE
  
  return (
    <Card key={item.name} border="dark" className="mb-2 bg-grey">
        <Card.Body>
            <Row>
                <Col xs={3}><Image src={item.metadata.imageUrl} rounded fluid="true" /></Col>
                <Col xs={6}>
                    <div className="mb-2">Name: {item.metadata.name}</div>
                    <div className="mb-2">Color: {item.metadata.color}</div>
                    <div className="mb-2">Price: {item.price}$</div>
                    <div className="mb-2">Available: only {item.metadata.quantity} listing</div>
                </Col>
                {item.owner === cu.addr ? (
                  <Col xs={3} className="list-btn">
                    <Button
                      colorScheme="orange"
                      size="sm"
                      disabled={BUSY}
                      onClick={item.cancelListing}
                    >
                      <HStack>
                        {BUSY && <Spinner mr="2" size="xs" />}
                        <Text>Unlist(My NFT)</Text>
                      </HStack>
                    </Button>
                  </Col>
                ) : (
                  <Col xs={3} className="list-btn">
                    <PurchaseDialog item={ item } />
                  </Col>
                )}
            </Row>
        </Card.Body>
    </Card>
  )
}

export default function WrappedMarketItemCluster(props) {
  return (
    <Suspense
      fallback={
        <Card>
        </Card>
      }
    >
      <MarketItemCluster {...props} />
    </Suspense>
  )
}

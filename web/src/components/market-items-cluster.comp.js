import {Suspense} from "react"
import {useMarketItems} from "../hooks/use-market-items.hook"
import Item from "./market-item-cluster.comp"
import {Box, Spinner, Alert, AlertIcon} from "@chakra-ui/react"

export function MarketItemsCluster() {
  const {items, status} = useMarketItems()

  if (items.length <= 0)
    return (
      <Alert status="info">
        <AlertIcon />
        No NFTs Listed For Sale
      </Alert>
    )

  return (
    <Box borderWidth="1px" borderRadius="lg">
      {items.map(item => (
        <Item
          key={item.resourceID}
          id={item.resourceID}
          address={item.owner}
          status={status}
        />
      ))}
    </Box>
  )
}

export default function WrappedMarketItemsCluster() {
  return (
    <Suspense
      fallback={
        <Box borderWidth="1px" borderRadius="lg" p="4">
          <Spinner />
        </Box>
      }
    >
      <MarketItemsCluster />
    </Suspense>
  )
}

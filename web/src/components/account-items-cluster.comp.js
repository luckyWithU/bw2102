import {Suspense} from "react"
import {useAccountItems} from "../hooks/use-account-items.hook"
//import {useCurrentUser} from "../hooks/use-current-user.hook"
import Item from "./account-item-cluster.comp"
import {Box, Spinner,Alert, AlertIcon} from "@chakra-ui/react"

export function AccountItemsCluster({address}) {
  const items = useAccountItems(address)
  //const [cu] = useCurrentUser()

  if (address == null) return null

  if (items.ids.length <= 0)
    return (
      <Alert status="info">
        <AlertIcon />
        You don't have any NFTs.
      </Alert>
    )

  return (
    <Box borderWidth="1px" borderRadius="lg">
      {items.ids.map(id => (
        <Item key={id} id={id} address={address} />
      ))}
    </Box>
  )
}

export default function WrappedAccountItemsCluster({address}) {
  return (
    <Suspense
      fallback={
        <Box borderWidth="1px" borderRadius="lg" p="4">
          <Spinner />
        </Box>
      }
    >
      <AccountItemsCluster address={address} />
    </Suspense>
  )
}

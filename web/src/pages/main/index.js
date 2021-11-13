import {Suspense} from "react"
import {Base} from "../../components/base.comp"
import {IDLE} from "../../global/constants"
import {useCurrentUser} from "../../hooks/use-current-user.hook"
import {useMarketItems} from "../../hooks/use-market-items.hook"
import {useAccountItems} from "../../hooks/use-account-items.hook"
import {useInitialized} from "../../hooks/use-initialized.hook"
import {useFUSDBalance} from "../../hooks/use-fusd-balance.hook"

import TopNav from "../../components/top-nav.comp"
import BalanceCluster from "../../components/balance-cluster.comp"
import MarketItemsCluster from "../../components/market-items-cluster.comp"
import AccountItemsCluster from "../../components/account-items-cluster.comp"
import PublishForm from "../../components/publish-form.comp"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Tag,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spinner,
  Button,
  HStack,
  Spacer,
} from "@chakra-ui/react"

export function MarketItemsCount() {
  let l = 0
  return l > 0 ? <Tag ml="1">{l}</Tag> : null
}

export function AccountItemsCount({address}) {
  const items = useAccountItems(address)
  if (items.status !== IDLE) return <Spinner size="xs" ml="1" />
  const l = items?.ids?.length ?? 0
  return l > 0 ? <Tag ml="1">{l}</Tag> : null
}

export function StoreItemsCount() {
  const items = useMarketItems()
  if (items.status !== IDLE) return <Spinner size="xs" ml="1" />
  const l = items?.ids?.length ?? 0
  return l > 0 ? <Tag ml="1">{l}</Tag> : null
}

export function MintButton({address}) {
  const items = useAccountItems(address)

  return (
    <Button disabled={items.status !== IDLE} onClick={items.mint}>
      Mint Item
    </Button>
  )
}

export function InfoBanner({address}) {
  const init = useInitialized(address)
  const fusd = useFUSDBalance(address)
  const [cu] = useCurrentUser()

  const status = {
    notInitialized: {
      type: "info",
      title: "Initialize Your Account",
      text: "You need to initialize your account before you can receive FUSD.",
    },
    noFUSD: {
      type: "info",
      title: "Get FUSD",
      text: "You need FUSD to buy BW Items.",
    },
  }

  function Banner(message) {
    return (
      <Flex my="4">
        <Alert status={message.type}>
          <AlertIcon />
          <AlertTitle mr={2}>{message.title}</AlertTitle>
          {message.text}
        </Alert>
      </Flex>
    )
  }

  switch (true) {
    //case !init.isInitialized && cu.addr === address:
      //return Banner(status.notInitialized)
    case fusd.balance < 0 && cu.addr === address:
      return Banner(status.noFUSD)
    default:
      return null
  }
}

export function Page() {
  const [cu] = useCurrentUser()
  const address = cu.addr
  if (address == null) return <div>Not Found</div>
  return (
    <Base>
      <TopNav address={address} />
      <Box p="4">
        <Suspense fallback={null}>
          <InfoBanner address={address} />
        </Suspense>
        <BalanceCluster address={address} />
        <Tabs  variant="enclosed" colorScheme="Green" defaultIndex={0}>
          <TabList>
            <Tab fontSize="2xl">
              <HStack>
                <Box>{cu.addr === address ? "My" : "User"} NFTs</Box>
              </HStack>
              <Suspense fallback={null}>
                <AccountItemsCount address={address} />
              </Suspense>
            </Tab>
            <Tab fontSize="2xl">
              <HStack>
                <Box>NFT Listings</Box>
              </HStack>
              <Suspense fallback={null}>
                <MarketItemsCount />
              </Suspense>
            </Tab>
            <Spacer />
            <Flex>
              <Box>
                <Suspense fallback={null}>
                  <PublishForm user={cu}/>
                </Suspense>
              </Box>
            </Flex>
          </TabList>

          <TabPanels>
            <TabPanel>
              <AccountItemsCluster address={address} />
            </TabPanel>
            <TabPanel>
              <MarketItemsCluster />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Base>
  )
}

import {Suspense} from "react"
//import {useFlowBalance} from "../hooks/use-flow-balance.hook"
import {useFUSDBalance} from "../hooks/use-fusd-balance.hook"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import {useConfig} from "../hooks/use-config.hook"
import {IDLE} from "../global/constants"
import {fmtFUSD} from "../util/fmt-fusd"
import {
  Box,
  Button,
  Text,
  Flex,
  Heading,
  Spinner,
  Center,
  Spacer
} from "@chakra-ui/react"
import {useInitialized} from "../hooks/use-initialized.hook"

export function BalanceCluster({address}) {
  //const flow = useFlowBalance(address)
  const fusd = useFUSDBalance(address)
  const init = useInitialized(address)
  const testnetFaucet = useConfig("faucet")

  function openFaucet() {
    window.open(testnetFaucet)
  }

  return (
    <Box mb="4" align="right">
        <Flex >
        <Spacer />
        <Center>
        {fusd.status === IDLE ? (
          <Text mr={1}>{fmtFUSD(fusd.balance)}</Text>
        ) : (
          <Text>
            <Spinner size="sm" />
          </Text>
        )}
        $
        </Center>
        <Button disabled={fusd.status !== IDLE || !init.isInitialized} colorScheme="blue" onClick={() => (testnetFaucet ? openFaucet() : fusd.mint())} ml={2}>get FUSD</Button>
        </Flex>
    </Box>

  )
}

export default function WrappedBalanceCluster(props) {
  const [cu] = useCurrentUser()
  if (cu.addr !== props.address) return null

  return (
    <Suspense
      fallback={
        <Flex>
          <Heading size="md" mr="4">
            Balances
          </Heading>
          <Center>
            <Spinner size="sm" />
          </Center>
        </Flex>
      }
    >
      <BalanceCluster {...props} />
    </Suspense>
  )
}

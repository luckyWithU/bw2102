import {Suspense} from "react"
import {useInitialized} from "../hooks/use-initialized.hook"
import {useFUSDBalance} from "../hooks/use-fusd-balance.hook"
import {Bar, Label, Button} from "../display/bar.comp"
import {IDLE} from "../global/constants"
import {Loading} from "../components/loading.comp"
import {fmtFUSD} from "../util/fmt-fusd"

export function BWTokensBalanceCluster({address}) {
  const init = useInitialized(address)
  const fusd = useFUSDBalance(address)
  if (address == null || !init.isInitialized) return null

  return (
    <Bar>
      <Label>BWTokens Balance:</Label>
      <Label strong good={fusd.balance > 0} bad={fusd.balance <= 0}>
        {fmtBWTokens(fusd.balance)}
      </Label>
      <Button disabled={fusd.status !== IDLE} onClick={fusd.refresh}>
        Refresh
      </Button>
      <Button disabled={fusd.status !== IDLE} onClick={fusd.mint}>
        Mint
      </Button>
      {bwtoken.status !== IDLE && <Loading label={fusd.status} />}
    </Bar>
  )
}

export default function WrappedBWTokensBalanceCluster({address}) {
  return (
    <Suspense
      fallback={
        <Bar>
          <Loading label="Fetching BWTokens Balance" />
        </Bar>
      }
    >
      <BWTokensBalanceCluster address={address} />
    </Suspense>
  )
}

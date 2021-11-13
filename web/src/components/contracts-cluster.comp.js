import {Bar, Label} from "../display/bar.comp"
import {useConfig} from "../hooks/use-config.hook"

const Link = ({address, name}) => {
  const env = useConfig("env")

  return (
    <li>
      {name}:{" "}
      <a href={fvs(env, address, name)} target="_blank" rel="noreferrer">
        {address}
      </a>
    </li>
  )
}

export function ContractsCluster() {
  const fusd = useConfig("0xFUSD")
  const items = useConfig("0xBWItems")
  const market = useConfig("0xBWItemsMarket")

  return (
    <div>
      <Bar>
        <Label>Contracts</Label>
      </Bar>
      <ul>
        <Link address={fusd} name="FUSD" />
        <Link address={items} name="BWItems" />
        <Link address={market} name="BWItemsMarket" />
      </ul>
    </div>
  )
}

export default function WrappedContractsCluster() {
  return <ContractsCluster />
}

function fvs(env, addr, contract) {
  return `https://flow-view-source.com/${env}/account/${addr}/contract/${contract}`
}

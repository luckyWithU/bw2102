import {atomFamily, selectorFamily, useRecoilState} from "recoil"
import {fetchAccountItems} from "../flow/script.get-account-items"
import {IDLE, PROCESSING} from "../global/constants"

export const $state = atomFamily({
  key: "account-items::state",
  default: selectorFamily({
    key: "account-items::default",
    get: address => async () => fetchAccountItems(address),
  }),
})

export const $status = atomFamily({
  key: "account-items::status",
  default: IDLE,
})

export function useAccountItems(address) {
  const [items, setItems] = useRecoilState($state(address))
  const [status, setStatus] = useRecoilState($status(address))

  return {
    ids: items,
    status,

    async mint(data) {
      //console.log("daf", process.env.REACT_APP_API_BW_ITEM_MINT)
      setStatus(PROCESSING)
      await fetch(process.env.REACT_APP_API_BW_ITEM_MINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: address,
          name: data.name,
          color: data.color,
          imageUrl: data.imageUrl,
          info: data.info,
          quantity: data.quantity,
          series: data.series,
          typeID: Math.floor(Math.random() * (5 - 1)) + 1,
        }),
      })
      await fetchAccountItems(address).then(setItems)
      setStatus(IDLE)
    },
    async refresh() {
      setStatus(PROCESSING)
      await fetchAccountItems(address).then(setItems)
      setStatus(IDLE)
    },
  }
}

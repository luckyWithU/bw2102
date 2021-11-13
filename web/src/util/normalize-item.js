export default function normalizeItem(item) {
  
  return Object.assign(
    {},
    {
      itemID: item.sale_item_id,
      resourceID: item.sale_item_resource_id,
      typeID: item.sale_item_type,
      owner: item.sale_item_owner,
      price: item.sale_price,
      txID: item.transaction_id,
      name: item.sale_item_name//lucky
    }
  )
}

import { BaseModel } from "./base";

class SaleOffer extends BaseModel {
  sale_item_id!: number;
  sale_item_resource_id!: number;
  sale_item_type!: number;
  sale_item_owner!: string;
  sale_price!: number;
  transaction_id!: string;
  sale_item_name!: string;//lucky
  static get tableName() {
    return "sale_offers";
  }
}

export { SaleOffer };

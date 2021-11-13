import { Knex } from "knex";

import * as bwItems from "./20201217175515_create_bw_items";
import * as saleOffers from "./20201217175722_create_sale_offers";

export async function up(knex: Knex): Promise<void> {
  await bwItems.down(knex);
  await saleOffers.down(knex);
}

export async function down(knex: Knex): Promise<void> {
  await bwItems.up(knex);
  await saleOffers.up(knex);
}

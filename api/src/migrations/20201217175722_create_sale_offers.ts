import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sale_offers", async (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.text("name");
    table.text("color");
    table.text("imageUrl");
    table.text("info");
    table.text("quantity");
    table.text("series");
    table.decimal("price");
    table.text("seller_address");
    table.text("tx_hash");
    table.boolean("is_complete").defaultTo(false);
    table.integer("bw_item_id").references("id").inTable("bw_items");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    "ALTER TABLE sale_offers DROP CONSTRAINT sale_offers_pkey CASCADE"
  );
  return knex.schema.dropTable("sale_offers");
}

import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sale_offers", async (table) => {
    table.integer("sale_item_id").primary();
    table.text("sale_item_name");
    table.text("sale_item_color");
    table.text("sale_item_imageUrl");
    table.text("sale_item_info");
    table.text("sale_item_quantity");
    table.text("sale_item_series");
    table.integer("sale_item_type").notNullable();
    table.text("sale_item_owner");
    table.decimal("sale_price");
    table.text("transaction_id");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("sale_offers");
}

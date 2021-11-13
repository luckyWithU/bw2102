import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("bw_items", async (table) => {
    table.integer("id").primary();
    table.integer("type_id");
    table.text("name");
    table.text("color");
    table.text("imageUrl");
    table.text("info");
    table.text("quanttity");
    table.text("series");
    table.text("owner_address");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    "ALTER TABLE bw_items DROP CONSTRAINT bw_items_pkey CASCADE"
  );
  return knex.schema.dropTable("bw_items");
}

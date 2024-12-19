/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.string("id").unique().primary();
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.string("role");
      table.boolean("is_verified").defaultTo(true);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("loginUsers", (table) => {
      table.uuid("id").primary();
      table
        .string("userId")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
      table.timestamp("login_time").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("loginUsers").dropTable("users");
};

import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Enable uuid-ossp extension for UUID generation
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('username', 255).notNullable().unique();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.integer('rating').notNullable().defaultTo(1200);
    table.text('avatar_url').nullable();
    table.text('bio').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index('username', 'users_username_index');
    table.index('email', 'users_email_index');
    table.index('rating', 'users_rating_index');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}

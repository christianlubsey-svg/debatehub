import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_stats', (table) => {
    table.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
    table.integer('total_debates').notNullable().defaultTo(0);
    table.integer('wins').notNullable().defaultTo(0);
    table.integer('losses').notNullable().defaultTo(0);
    table.integer('draws').notNullable().defaultTo(0);
    table.jsonb('rating_history').nullable().defaultTo('[]'); // Array of {date, rating} objects
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index('total_debates', 'user_stats_total_debates_index');
    table.index('wins', 'user_stats_wins_index');
    table.index('updated_at', 'user_stats_updated_at_index');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_stats');
}

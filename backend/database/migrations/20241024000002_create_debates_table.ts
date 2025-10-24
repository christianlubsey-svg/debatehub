import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('debates', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('topic').notNullable();
    table.text('description').nullable();
    table.enum('mode', ['unmoderated', 'moderated']).notNullable();
    table.enum('status', ['waiting', 'active', 'concluded']).notNullable().defaultTo('waiting');
    table.uuid('created_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('winner_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('concluded_at').nullable();

    // Indexes
    table.index('created_by', 'debates_created_by_index');
    table.index('status', 'debates_status_index');
    table.index('mode', 'debates_mode_index');
    table.index('created_at', 'debates_created_at_index');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('debates');
}

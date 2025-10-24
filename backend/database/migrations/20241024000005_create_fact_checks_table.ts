import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fact_checks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('message_id').notNullable().references('id').inTable('messages').onDelete('CASCADE');
    table.text('claim').notNullable();
    table.text('verification_result').nullable();
    table.decimal('confidence_score', 3, 2).nullable().checkBetween([0, 1]);
    table.jsonb('sources').nullable(); // Array of source URLs
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index('message_id', 'fact_checks_message_id_index');
    table.index('confidence_score', 'fact_checks_confidence_score_index');
    table.index('created_at', 'fact_checks_created_at_index');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('fact_checks');
}

import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('debate_participants', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('debate_id').notNullable().references('id').inTable('debates').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enum('side', ['for', 'against', 'neutral']).notNullable();
    table.timestamp('joined_at').notNullable().defaultTo(knex.fn.now());

    // Unique constraint: a user can only participate once per debate
    table.unique(['debate_id', 'user_id'], {
      indexName: 'debate_participants_debate_user_unique',
    });

    // Indexes
    table.index('debate_id', 'debate_participants_debate_id_index');
    table.index('user_id', 'debate_participants_user_id_index');
    table.index('side', 'debate_participants_side_index');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('debate_participants');
}

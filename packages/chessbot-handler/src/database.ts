import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { config } from './config.js';
import { DB } from './postgres_types.js';

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: config.DATABASE_URL,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});

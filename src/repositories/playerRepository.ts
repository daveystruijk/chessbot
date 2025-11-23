import { FunctionModule, Transaction } from 'kysely';
import { DB, Players } from '../postgres_types.js';

const withRank = ({ fn }: { fn: FunctionModule<DB, 'players'> }) =>
  fn
    .agg<number>('rank')
    .over((o) => o.orderBy('score', 'desc'))
    .as('rank');

export const playerRepository = {
  getAll: async (t: Transaction<DB>) => t.selectFrom('players').selectAll().select(withRank).limit(20).execute(),

  find: async (t: Transaction<DB>, { playerId }: { playerId: string }) =>
    t
      .with('players_with_rank', (w) => w.selectFrom('players').selectAll().select(withRank))
      .selectFrom('players_with_rank')
      .selectAll()
      .where('player_id', '=', playerId)
      .executeTakeFirstOrThrow(),

  findOrCreate: async (t: Transaction<DB>, { playerId, playerName }: { playerId: string; playerName: string }) =>
    t
      .insertInto('players')
      .values({
        player_id: playerId,
        player_name: playerName,
        score: 1000,
      })
      .onConflict((oc) =>
        oc.column('player_id').doUpdateSet({
          player_name: playerName,
        }),
      )
      .executeTakeFirstOrThrow(),

  updateScore: async (t: Transaction<DB>, { playerId, score }: { playerId: string; score: number }) =>
    t.updateTable('players').set({ score }).where('player_id', '=', playerId).executeTakeFirstOrThrow(),
};

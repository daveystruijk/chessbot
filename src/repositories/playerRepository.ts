import { Transaction } from 'kysely';
import { DB } from '../postgres_types.js';

export const playerRepository = {
  getAll: async (t: Transaction<DB>) => t.selectFrom('players').selectAll().execute(),

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
      .returningAll()
      .executeTakeFirstOrThrow(),

  updateScore: async (t: Transaction<DB>, { playerId, score }: { playerId: string; score: number }) =>
    t.updateTable('players').set({ score }).where('player_id', '=', playerId).execute(),
};

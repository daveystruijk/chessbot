import { Insertable, Transaction } from 'kysely';
import { DB, Matches } from '../postgres_types.js';

export const matchRepository = {
  create: (t: Transaction<DB>, values: Insertable<Matches>) => t.insertInto('matches').values(values).execute(),

  findBetweenPlayers: (
    t: Transaction<DB>,
    { player_a_id, player_b_id }: { player_a_id: string; player_b_id: string },
  ) =>
    t
      .selectFrom('matches')
      .where((eb) =>
        eb.or([
          eb('player_a_id', '=', player_a_id).and('player_b_id', '=', player_b_id),
          eb('player_a_id', '=', player_b_id).and('player_b_id', '=', player_a_id),
        ]),
      )
      .selectAll()
      .execute(),
};

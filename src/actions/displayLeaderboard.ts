import { db } from '../database.js';
import { playerRepository } from '../repositories/playerRepository.js';
import { formatPlayerTable } from '../utils/formatting.js';
import { ActionHandler } from './index.js';

export const displayLeaderboard: ActionHandler<'displayLeaderboard'> = async (action, entities) => {
  return db.transaction().execute(async (t) => {
    const players = await playerRepository.getAll(t);
    return { blocks: [formatPlayerTable(players)] };
  });
};

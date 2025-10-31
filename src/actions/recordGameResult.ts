import { GameResult } from '../entities/GameResult.js';
import { Player } from '../entities/Player.js';
import { ActionHandler } from './index.js';

export const recordGameResult: ActionHandler<'recordGameResult'> = async (action, entities) => {
  const { playerAId, playerBId, winner } = action;

  const playerA = await entities.findOrCreate(Player, { playerId: playerAId }, { score: 1000 });
  const playerB = await entities.findOrCreate(Player, { playerId: playerBId }, { score: 1000 });

  entities.create(GameResult, { playerA, playerB, winner });

  return {
    blocks: [{ type: 'section' }],
  };
};

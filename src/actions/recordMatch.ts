import { db } from '../database.js';
import { playerRepository } from '../repositories/playerRepository.js';
import { slackRepository } from '../repositories/slackRepository.js';
import { formatPlayerTable } from '../utils/formatting.js';
import { calculateRanking } from '../utils/ranking.js';
import { ActionHandler } from './index.js';

export const recordMatch: ActionHandler<'recordMatch'> = async (action, { client }) => {
  return db.transaction().execute(async (t) => {
    const { playerAId, playerBId, winner } = action;

    // Find or update players
    const playerAName = await slackRepository.getUsername(client, { userId: playerAId });
    const playerA = await playerRepository.findOrCreate(t, { playerId: playerAId, playerName: playerAName });

    const playerBName = await slackRepository.getUsername(client, { userId: playerBId });
    const playerB = await playerRepository.findOrCreate(t, { playerId: playerBId, playerName: playerBName });

    // Record match result
    await t.insertInto('matches').values({ player_a_id: playerAId, player_b_id: playerBId, winner }).execute();

    // Calculate scores
    const { scoreA, scoreB } = calculateRanking({ scoreA: playerA.score, scoreB: playerB.score, winner });

    // Persist scores
    const updatedPlayerA = await playerRepository.updateScore(t, { playerId: playerAId, score: scoreA });
    const updatedPlayerB = await playerRepository.updateScore(t, { playerId: playerBId, score: scoreB });

    // Output table to slack
    const table = [
      {
        ...updatedPlayerA,
        oldRank: playerA.rank,
        oldScore: playerA.score,
      },
      {
        ...updatedPlayerB,
        oldRank: playerB.rank,
        oldScore: playerB.score,
      },
    ].sort((player) => player.rank);

    return formatPlayerTable(table);
  });
};

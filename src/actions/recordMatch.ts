import { db } from '../database.js';
import { playerRepository } from '../repositories/playerRepository.js';
import { slackRepository } from '../repositories/slackRepository.js';
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
    t.insertInto('matches').values({ player_a_id: playerAId, player_b_id: playerBId, winner });

    // Calculate scores
    const { scoreA, scoreB } = calculateRanking({ scoreA: playerA.score, scoreB: playerB.score, winner });

    // Persist scores
    await playerRepository.updateScore(t, { playerId: playerAId, score: scoreA });
    await playerRepository.updateScore(t, { playerId: playerBId, score: scoreB });

    return ['Updated scores:', `- ${playerA.player_name}: ${scoreA}`, `- ${playerB.player_name}: ${scoreB}`].join('\n');
  });
};

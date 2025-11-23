import { Selectable } from 'kysely';
import { db } from '../database.js';
import { Matches } from '../postgres_types.js';
import { matchRepository } from '../repositories/matchRepository.js';
import { playerRepository } from '../repositories/playerRepository.js';
import { slackRepository } from '../repositories/slackRepository.js';
import { formatContext, formatPlayerTable } from '../utils/formatting.js';
import { calculateRanking } from '../utils/ranking.js';
import { ActionHandler } from './index.js';

const countWins = ({ matches, playerId }: { matches: Selectable<Matches>[]; playerId: string }) =>
  matches.filter(
    (match) =>
      (match.player_a_id === playerId && match.winner === 'player_a') ||
      (match.player_b_id === playerId && match.winner === 'player_b'),
  ).length;

export const recordMatch: ActionHandler<'recordMatch'> = async (action, { client }) => {
  return db.transaction().execute(async (t) => {
    const { playerAId, playerBId, winner } = action;

    // Find or update players
    const playerAName = await slackRepository.getUsername(client, { userId: playerAId });
    await playerRepository.findOrCreate(t, { playerId: playerAId, playerName: playerAName });
    const playerA = await playerRepository.find(t, { playerId: playerAId });

    const playerBName = await slackRepository.getUsername(client, { userId: playerBId });
    await playerRepository.findOrCreate(t, { playerId: playerBId, playerName: playerBName });
    const playerB = await playerRepository.find(t, { playerId: playerBId });

    // Record match result
    await matchRepository.create(t, { player_a_id: playerAId, player_b_id: playerBId, winner });

    // Calculate scores
    const { scoreA, scoreB } = calculateRanking({ scoreA: playerA.score, scoreB: playerB.score, winner });

    // Persist scores
    await playerRepository.updateScore(t, { playerId: playerAId, score: scoreA });
    await playerRepository.updateScore(t, { playerId: playerBId, score: scoreB });

    // Retrieve new player rankings
    const updatedPlayerA = await playerRepository.find(t, { playerId: playerAId });
    const updatedPlayerB = await playerRepository.find(t, { playerId: playerBId });

    // Retrieve context between players
    const matches = await matchRepository.findBetweenPlayers(t, {
      player_a_id: playerAId,
      player_b_id: playerBId,
    });
    const playerAWins = countWins({ matches, playerId: playerAId });
    const playerBWins = countWins({ matches, playerId: playerBId });

    // Output table (with diffs) to slack
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

    return {
      blocks: [
        formatPlayerTable(table),
        formatContext(
          `*${playerA.player_name}* and *${playerB.player_name}* played ${playerAWins}-${playerBWins} in total (${matches.length} games)`,
        ),
      ],
    };
  });
};

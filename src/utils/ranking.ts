import { Winner } from '../postgres_types.js';

const kFactor = 15;

export const calculateRanking = ({
  scoreA,
  scoreB,
  winner,
}: {
  scoreA: number;
  scoreB: number;
  winner: Winner;
}): { scoreA: number; scoreB: number } => {
  const expectation = 1 / (1 + Math.pow(10, (scoreB - scoreA) / 400));

  const result = {
    player_a: 1,
    draw: 0.5,
    player_b: 0,
  }[winner];

  return {
    scoreA: scoreA + kFactor * (result - expectation),
    scoreB: scoreB + kFactor * (expectation - result),
  };
};

import { describe, expect, test } from 'vitest';
import { calculateRanking } from './ranking.js';

describe(import.meta.filename, async () => {
  test('calculateRanking: a draw on equal rating does nothing', () => {
    const input = { scoreA: 1000, scoreB: 1000, winner: 'draw' } as const;

    const { scoreA, scoreB } = calculateRanking(input);

    expect(scoreA).toBeCloseTo(1000);
    expect(scoreB).toBeCloseTo(1000);
  });

  test('calculateRanking: player A winning should increase their score (by K on equal rating)', () => {
    const input = { scoreA: 1000, scoreB: 1000, winner: 'player_a' } as const;

    const { scoreA, scoreB } = calculateRanking(input);

    expect(scoreA - scoreB).toBeCloseTo(15);
  });

  test('calculateRanking: player A winning from a much lower-rated opponent should not do much to their score', () => {
    const input = { scoreA: 2000, scoreB: 500, winner: 'player_a' } as const;

    const { scoreA, scoreB } = calculateRanking(input);

    expect(scoreA).toBeCloseTo(2000);
    expect(scoreB).toBeCloseTo(500);
  });
});

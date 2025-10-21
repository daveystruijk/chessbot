import { describe, expect, test } from 'vitest';
import { calculateRanking } from './ranking.js';

describe(import.meta.filename, async () => {
  test('calculateRanking: a draw on equal rating does nothing', () => {
    const input = { playerA: 1000, playerB: 1000, winner: 'draw' } as const;

    const { playerA, playerB } = calculateRanking(input);

    expect(playerA).toBeCloseTo(1000);
    expect(playerB).toBeCloseTo(1000);
  });

  test('calculateRanking: player A winning should increase their score (by K on equal rating)', () => {
    const input = { playerA: 1000, playerB: 1000, winner: 'playerA' } as const;

    const { playerA, playerB } = calculateRanking(input);

    expect(playerA - playerB).toBeCloseTo(15);
  });

  test('calculateRanking: player A winning from a much lower-rated opponent should not do much to their score', () => {
    const input = { playerA: 2000, playerB: 500, winner: 'playerA' } as const;

    const { playerA, playerB } = calculateRanking(input);

    console.log();

    expect(playerA).toBeCloseTo(2000);
    expect(playerB).toBeCloseTo(500);
  });
});

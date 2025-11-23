import { describe, expect, test } from 'vitest';
import { formatPlayerRow, formatPlayerTable } from './formatting.js';

describe(import.meta.filename, () => {
  test('formatPlayerRow', async () => {
    const player = { rank: 1, player_name: 'Magnus Carsten', score: 3000.123 };
    const output = formatPlayerRow(player);
    expect(output[0].elements[0].elements[0]).toEqual({ type: 'text', text: '1.' });
    expect(output[1].elements[0].elements[0]).toEqual({ type: 'text', text: 'Magnus Carsten' });
    expect(output[2].elements[0].elements[0]).toEqual({ type: 'text', text: '3000' });
  });

  test('formatPlayerRow with diffs', async () => {
    const player = { rank: 1, player_name: 'Magnus Carsten', score: 3000.123, oldRank: 2, oldScore: 2900.3 };
    const output = formatPlayerRow(player);
    expect(output[0].elements[0].elements[0]).toEqual({ type: 'text', text: '1. (+1)' });
    expect(output[1].elements[0].elements[0]).toEqual({ type: 'text', text: 'Magnus Carsten' });
    expect(output[2].elements[0].elements[0]).toEqual({ type: 'text', text: '3000 (+100)' });
  });

  test('formatPlayerTable', async () => {
    const players = [
      { rank: 1, player_name: 'Magnus Carsten', score: 3000.123 },
      { rank: 2, player_name: 'Danny Kasparov', score: 2900 },
      { rank: 3, player_name: 'Anish Bierie', score: 2890.5, oldRank: 1, oldScore: 3001 },
    ];
    const output = formatPlayerTable(players);
    await expect(output).toMatchFileSnapshot('formatting.snapshot.json5'); // Useful: https://app.slack.com/block-kit-builder/
  });
});

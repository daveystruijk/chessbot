import { tryParse } from 'peberminta';
import { describe, expect, test } from 'vitest';
import { alphanumeric, recordDraw, recordLoss, recordWin, userId } from './messageParser.js';

describe(import.meta.filename, () => {
  test('invalid alphanumeric', () => {
    const input = '!@#ABCx';
    const result = tryParse(alphanumeric, [...input], {});
    expect(result).toEqual(undefined);
  });

  test('valid alphanumeric', () => {
    const input = 'USERID';
    const result = tryParse(alphanumeric, [...input], {});
    expect(result).toEqual('USERID');
  });

  test('invalid userId', () => {
    const input = '<@USERID';
    const result = tryParse(userId, [...input], {});
    expect(result).toEqual(undefined);
  });

  test('valid userId', () => {
    const input = '<@USERID>';
    const result = tryParse(userId, [...input], {});
    expect(result).toEqual('USERID');
  });

  test('valid recordWin', () => {
    const input = '<@A> won from <@B>';
    const result = tryParse(recordWin, [...input], {});
    expect(result).toEqual({ action: 'recordGameResult', playerAId: 'A', playerBId: 'B', winner: 'playerA' });
  });

  test('valid recordLoss', () => {
    const input = '<@A> lost vs <@B>';
    const result = tryParse(recordLoss, [...input], {});
    expect(result).toEqual({ action: 'recordGameResult', playerAId: 'A', playerBId: 'B', winner: 'playerB' });
  });

  test('valid recordDraw', () => {
    const input = '<@A> ties against <@B>';
    const result = tryParse(recordDraw, [...input], {});
    expect(result).toEqual({ action: 'recordGameResult', playerAId: 'A', playerBId: 'B', winner: 'draw' });
  });
});

import { tryParse } from 'peberminta';
import { describe, expect, test } from 'vitest';
import { alphanumeric, lossResult, userIdentifier, winResult } from './messageParser.js';

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

  test('invalid userIdentifier', () => {
    const input = '<@USERID';
    const result = tryParse(userIdentifier, [...input], {});
    expect(result).toEqual(undefined);
  });

  test('valid userIdentifier', () => {
    const input = '<@USERID>';
    const result = tryParse(userIdentifier, [...input], {});
    expect(result).toEqual('USERID');
  });

  test('valid winResult', () => {
    const input = '<@WINNER> won from <@LOSER>';
    const result = tryParse(winResult, [...input], {});
    expect(result).toEqual({ winner: 'WINNER', loser: 'LOSER' });
  });

  test('valid lossResult', () => {
    const input = '<@LOSER> lost vs <@WINNER>';
    const result = tryParse(lossResult, [...input], {});
    expect(result).toEqual({ winner: 'WINNER', loser: 'LOSER' });
  });
});

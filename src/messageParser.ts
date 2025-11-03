import { abc, choice, many1, map, middle, or, parse, Parser } from 'peberminta';
import { anyOf, concat, str } from 'peberminta/char';
import { Action } from './actions/index.js';

export const alphanumeric = concat(many1(anyOf('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ')));
export const userIdentifier = middle(str('<@'), alphanumeric, str('>'));

export const winWords = choice(str(' won against '), str(' won vs '), str(' won from '));
export const winResult = abc(userIdentifier, winWords, userIdentifier, (playerAId, _, playerBId) => ({
  playerAId,
  playerBId,
  winner: 'playerA',
}));

export const lossWords = choice(str(' lost against '), str(' lost vs '), str(' lost from '));
export const lossResult = abc(userIdentifier, lossWords, userIdentifier, (playerAId, _, playerBId) => ({
  playerAId,
  playerBId,
  winner: 'playerB',
}));

export const drawWords = choice(str(' ties against '), str(' ties vs '));
export const drawResult = abc(userIdentifier, drawWords, userIdentifier, (playerAId, _, playerBId) => ({
  playerAId,
  playerBId,
  winner: 'draw',
}));

export const recordGameResult: Parser<string, unknown, Action> = map(
  or(winResult, lossResult),
  ({ playerAId, playerBId, winner }) => ({ action: 'recordGameResult', playerAId, playerBId, winner }),
);

export const displayLeaderboard: Parser<string, unknown, Action> = map(str('leaderboard'), () => ({
  action: 'displayLeaderboard',
}));

export const action = or(recordGameResult, displayLeaderboard);

export const parseMessage = (message: string): Action => parse(action, [...message], {});

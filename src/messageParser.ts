import { abc, choice, many1, map, middle, or, parse, Parser } from 'peberminta';
import { anyOf, concat, str } from 'peberminta/char';
import { Action } from './actions/index.js';

export const alphanumeric = concat(many1(anyOf('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ')));
export const userIdentifier = middle(str('<@'), alphanumeric, str('>'));

export const winWords = choice(str(' won against '), str(' won vs '), str(' won from '));
export const winResult = abc(userIdentifier, winWords, userIdentifier, (winner, _, loser) => ({
  winner,
  loser,
}));

export const lossWords = choice(str(' lost against '), str(' lost vs '), str(' lost from '));
export const lossResult = abc(userIdentifier, lossWords, userIdentifier, (loser, _, winner) => ({
  winner,
  loser,
}));

export const recordGameResult: Parser<string, unknown, Action> = map(
  or(winResult, lossResult),
  ({ winner, loser }) => ({ action: 'recordGameResult', winner, loser }),
);

export const displayLeaderboard: Parser<string, unknown, Action> = map(str('leaderboard'), () => ({
  action: 'displayLeaderboard',
}));

export const action = or(recordGameResult, displayLeaderboard);

export const parseMessage = (message: string): Action => parse(action, [...message], {});

import { abc, choice, many1, map, middle, or, parse, Parser } from 'peberminta';
import { anyOf, concat, str } from 'peberminta/char';
import { Action } from './actions/index.js';

export const alphanumeric = concat(many1(anyOf('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ')));
export const userId = middle(str('<@'), alphanumeric, str('>'));

export const winWords = choice(str(' won against '), str(' won vs '), str(' won from '));
export const recordWin: Parser<string, unknown, Action> = abc(userId, winWords, userId, (playerAId, _, playerBId) => ({
  action: 'recordGameResult',
  playerAId,
  playerBId,
  winner: 'playerA',
}));

export const lossWords = choice(str(' lost against '), str(' lost vs '), str(' lost from '));
export const recordLoss: Parser<string, unknown, Action> = abc(
  userId,
  lossWords,
  userId,
  (playerAId, _, playerBId) => ({
    action: 'recordGameResult',
    playerAId,
    playerBId,
    winner: 'playerB',
  }),
);

export const drawWords = choice(str(' ties against '), str(' ties vs '));
export const recordDraw: Parser<string, unknown, Action> = abc(
  userId,
  drawWords,
  userId,
  (playerAId, _, playerBId) => ({
    action: 'recordGameResult',
    playerAId,
    playerBId,
    winner: 'draw',
  }),
);

export const displayLeaderboard: Parser<string, unknown, Action> = map(str('leaderboard'), () => ({
  action: 'displayLeaderboard',
}));

export const action = or(recordWin, recordLoss, recordDraw, displayLeaderboard);

export const parseMessage = (message: string): Action => parse(action, [...message], {});

import { SayArguments } from '@slack/bolt';
import { MessageContext } from '../main.js';
import { Winner } from '../postgres_types.js';

export type Action =
  | { action: 'recordMatch'; playerAId: string; playerBId: string; winner: Winner }
  | { action: 'displayLeaderboard' };

export type ActionHandler<A extends Action['action']> = (
  action: { action: A } & Action,
  context: MessageContext,
) => Promise<string | SayArguments>;

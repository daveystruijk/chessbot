import { SayArguments } from '@slack/bolt';
import { EntityManager } from 'joist-orm';
import { Winner } from '../entities/entities.js';

export type Action =
  | { action: 'recordGameResult'; playerAId: string; playerBId: string; winner: Winner }
  | { action: 'displayLeaderboard' };

export type ActionHandler<A extends Action['action']> = (
  action: { action: A } & Action,
  entities: EntityManager,
) => Promise<string | SayArguments>;

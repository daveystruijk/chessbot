import { SayArguments } from '@slack/bolt';

export type Action =
  | { action: 'recordGameResult'; playerAId: string; playerBId: string; winner: 'playerA' | 'playerB' | 'draw' }
  | { action: 'displayLeaderboard' };

export type ActionHandler<A extends Action['action']> = (
  action: { action: A } & Action,
  entities: EntityManager,
) => Promise<string | SayArguments>;

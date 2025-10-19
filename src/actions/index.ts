export type Action = { action: 'recordGameResult'; winner: string; loser: string } | { action: 'displayLeaderboard' };

export type ActionHandler<A extends Action['action']> = (action: { action: A } & Action) => Promise<void>;

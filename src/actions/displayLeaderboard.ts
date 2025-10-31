import { ActionHandler } from './index.js';

export const displayLeaderboard: ActionHandler<'displayLeaderboard'> = async (action, entities) => {
  return 'leaderboard';
};

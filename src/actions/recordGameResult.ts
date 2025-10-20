import { ActionHandler } from './index.js';

export const recordGameResult: ActionHandler<'recordGameResult'> = async (action) => {
  const { winner, loser } = action;

  return {
    blocks: [{ type: 'section' }],
  };
};

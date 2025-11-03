import { ActionHandler } from './index.js';

export const recordGameResult: ActionHandler<'recordGameResult'> = async (action, entities) => {
  const { playerAId, playerBId, winner } = action;

  return {
    blocks: [{ type: 'section' }],
  };
};

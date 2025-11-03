import { db } from '../database.js';
import { ActionHandler } from './index.js';

export const recordMatch: ActionHandler<'recordMatch'> = async (action) => {
  const { playerAId, playerBId, winner } = action;

  return {
    blocks: [{ type: 'section' }],
  };
};

import { MessageContext } from '../main.js';

export const slackRepository = {
  getUsername: async (client: MessageContext['client'], { userId }: { userId: string }) => {
    const { user } = await client.users.info({ user: userId });
    const name = user?.profile?.display_name || user?.profile?.real_name;
    if (!name) {
      throw new Error(`Could not fetch slack username for id ${userId}`);
    }
    return name;
  },
};

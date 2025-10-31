import { App } from '@slack/bolt';
import { EntityManager } from 'joist-orm';
import { displayLeaderboard } from './actions/displayLeaderboard.js';
import { Action } from './actions/index.js';
import { recordGameResult } from './actions/recordGameResult.js';
import { config } from './config.js';
import { getEntityManager } from './database.js';
import { parseMessage } from './messageParser.js';

const app = new App({
  signingSecret: config.SLACK_SIGNING_SECRET,
  token: config.SLACK_BOT_TOKEN,
  appToken: config.SLACK_APP_TOKEN,
  socketMode: true,
});

const performAction = async (action: Action, entities: EntityManager) => {
  if (action.action === 'displayLeaderboard') {
    return displayLeaderboard(action, entities);
  } else if (action.action === 'recordGameResult') {
    return recordGameResult(action, entities);
  }
  return 'Unrecognized action';
};

app.event('message', async ({ message, say }) => {
  if (message.subtype || !message.text) {
    return;
  }

  const action = parseMessage(message.text);
  const entities = getEntityManager();
  const response = await performAction(action, entities);
  entities.flush();
  say(response);
});

await app.start();

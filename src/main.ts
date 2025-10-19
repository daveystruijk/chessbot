import { App } from '@slack/bolt';
import { displayLeaderboard } from './actions/displayLeaderboard.js';
import { recordGameResult } from './actions/recordGameResult.js';
import { config } from './config.js';
import { logger } from './logger.js';
import { parseMessage } from './messageParser.js';

const app = new App({
  signingSecret: config.SLACK_SIGNING_SECRET,
  token: config.SLACK_BOT_TOKEN,
  appToken: config.SLACK_APP_TOKEN,
  socketMode: true,
});

app.event('message', async ({ message }) => {
  if (message.subtype || !message.text) {
    return;
  }

  const action = parseMessage(message.text);
  logger.info(action);

  if (action.action === 'displayLeaderboard') {
    await displayLeaderboard(action);
  } else if (action.action === 'recordGameResult') {
    await recordGameResult(action);
  }
});

await app.start();

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

app.event('message', async ({ message, say }) => {
  if (message.subtype || !message.text) {
    return;
  }

  const action = parseMessage(message.text);
  logger.info(action);

  if (action.action === 'displayLeaderboard') {
    const response = await displayLeaderboard(action);
    say(response);
  } else if (action.action === 'recordGameResult') {
    const response = await recordGameResult(action);
    say(response);
  }
});

await app.start();

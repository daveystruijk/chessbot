import { App } from '@slack/bolt';
import { displayLeaderboard } from './actions/displayLeaderboard.js';
import { Action } from './actions/index.js';
import { recordMatch } from './actions/recordMatch.js';
import { config } from './config.js';
import { parseMessage } from './messageParser.js';

const app = new App({
  signingSecret: config.SLACK_SIGNING_SECRET,
  token: config.SLACK_BOT_TOKEN,
  appToken: config.SLACK_APP_TOKEN,
  socketMode: true,
});

const performAction = async (action: Action) => {
  if (action.action === 'displayLeaderboard') {
    return displayLeaderboard(action);
  } else if (action.action === 'recordMatch') {
    return recordMatch(action);
  }
  return 'Unrecognized action';
};

app.event('message', async ({ message, say }) => {
  if (message.subtype || !message.text) {
    return;
  }

  const action = parseMessage(message.text);
  const response = await performAction(action);
  say(response);
});

await app.start();

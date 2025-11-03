import { AllMiddlewareArgs, App, SlackEventMiddlewareArgs } from '@slack/bolt';
import { displayLeaderboard } from './actions/displayLeaderboard.js';
import { Action } from './actions/index.js';
import { recordMatch } from './actions/recordMatch.js';
import { config } from './config.js';
import { parseMessage } from './messageParser.js';

export type MessageContext = SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs;

const app = new App({
  signingSecret: config.SLACK_SIGNING_SECRET,
  token: config.SLACK_BOT_TOKEN,
  appToken: config.SLACK_APP_TOKEN,
  socketMode: true,
});

const performAction = async (action: Action, context: MessageContext) => {
  if (action.action === 'displayLeaderboard') {
    return displayLeaderboard(action, context);
  } else if (action.action === 'recordMatch') {
    return recordMatch(action, context);
  }
  return 'Unrecognized action';
};

app.event('message', async (context: MessageContext) => {
  const { message, say } = context;

  if (message.subtype || !message.text) {
    return;
  }

  const action = parseMessage(message.text);
  const response = await performAction(action, context);
  say(response);
});

await app.start();

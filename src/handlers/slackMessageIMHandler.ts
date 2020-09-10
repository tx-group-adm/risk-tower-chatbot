import { ISlackMessageIMEvent } from '../interfaces';
import { WebClient } from '@slack/web-api';
import DataService from '../services/DialogflowService';

export const slackMessageIMHandler = async (event: ISlackMessageIMEvent): Promise<void> => {
	console.log(`Slack message IM handler called with event: ${JSON.stringify(event)}`);

	const { DIALOGFLOW_PROJECT_ID, SLACK_BOT_TOKEN } = process.env;
	const webClient = new WebClient(SLACK_BOT_TOKEN);

	if (!event.hasOwnProperty('bot_id')) {
		console.log(`user event`);
	} else {
		console.log(`bot event`);
	}
};

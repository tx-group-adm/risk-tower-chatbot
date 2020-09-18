import { ISlackMessageIMEvent } from '../interfaces';
import { WebClient } from '@slack/web-api';
import DialogflowService from '../services/DialogflowService';
import { slackify } from '../utils/slackify';

export const slackMessageIMHandler = async (event: ISlackMessageIMEvent): Promise<void> => {
	console.log(`Slack message IM handler called with event: ${JSON.stringify(event)}`);

	const { DIALOGFLOW_PROJECT_ID, SLACK_BOT_TOKEN } = process.env;
	const dialogflowService = new DialogflowService(DIALOGFLOW_PROJECT_ID as string);
	const webClient = new WebClient(SLACK_BOT_TOKEN);

	if (event.hasOwnProperty('bot_id')) {
		console.log(`bot event`);
		return Promise.resolve();
	} else {
		console.log(`user event`);

		const sessionId = event.user;
		const response = await dialogflowService.processTextMessage(event.text, sessionId);

		const message = slackify(response, event);

		await webClient.chat.postMessage({
			channel: event.channel,
			text: message,
		});

		console.log(`Message sent to client`);
		return Promise.resolve();
	}
};

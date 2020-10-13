import { ISlackMessageIMEvent, ISLackProfile } from '../interfaces';
import { WebClient } from '@slack/web-api';
import DialogflowService from '../services/DialogflowService';
import { slackify } from '../utils/slackify';

export const slackMessageIMHandler = async (event: ISlackMessageIMEvent): Promise<void> => {
	const { DIALOGFLOW_PROJECT_ID, SLACK_BOT_TOKEN } = process.env;
	const dialogflowService = new DialogflowService(DIALOGFLOW_PROJECT_ID as string);
	const webClient = new WebClient(SLACK_BOT_TOKEN, { retryConfig: { retries: 0 } });

	if (event.hasOwnProperty('bot_id')) {
		console.log(`ignore bot event`);
		return Promise.resolve();
	} else {
		console.log(`user event`);

		const sessionId = event.user;

		const email = (((await webClient.users.profile.get({
			user: event.user,
		})) as unknown) as ISLackProfile).profile.email;

		const response = await dialogflowService.processTextMessage(event.text, sessionId, email);

		const message = slackify(response, event);

		await webClient.chat.postMessage({
			channel: event.channel,
			text: message,
		});

		console.log(`Message sent to client`);
		return Promise.resolve();
	}
};

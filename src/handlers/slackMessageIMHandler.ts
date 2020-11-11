import { ISlackMessageIMEvent, ISLackProfile } from '../interfaces';
import { WebClient } from '@slack/web-api';
import DialogflowService from '../services/DialogflowService';
import { slackify } from '../utils/slackify';
import { createDiagram } from '../helpers/createDiagram';
import { createQuickReplyBlock } from '../helpers/createQuickReplyBlock';

export const slackMessageIMHandler = async (event: ISlackMessageIMEvent): Promise<void> => {
	const { DIALOGFLOW_PROJECT_ID, SLACK_BOT_TOKEN } = process.env;
	const dialogflowService = new DialogflowService(DIALOGFLOW_PROJECT_ID as string);
	const webClient = new WebClient(SLACK_BOT_TOKEN, { retryConfig: { retries: 0 } });

	try {
		if (event.bot_id) {
			console.log(`ignore bot event`);
			return Promise.resolve();
		} else if (event.upload) {
			console.log(`ignore file upload`);
			return Promise.resolve();
		} else {
			console.log(event);
			const sessionId = event.user;
			const email = (((await webClient.users.profile.get({
				user: event.user,
			})) as unknown) as ISLackProfile).profile.email;

			const { fulfillmentMessage, payload } = await dialogflowService.processTextMessage(event.text, sessionId, email);
			let message = slackify(fulfillmentMessage, event);

			console.log(JSON.stringify(payload));

			if (message.includes('@chart')) {
				console.log('got chart data:');
				console.log(message);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const match = message.match(/@chart{.+}/g)![0];
				const chartString = match.split('@chart')[1];
				const chartData: { impact: number; probability: number } = JSON.parse(chartString);
				message = message.replace(/@chart{.+}/g, '');
				const diagram = await createDiagram(chartData);
				await webClient.chat.postMessage({
					channel: event.channel,
					text: message,
				});
				await webClient.files.upload({
					title: 'My static file',
					file: diagram,
					channels: event.channel,
				});
			} else {
				if (message.includes('@options')) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					const match = message.match(/@options\[.+\]/g)![0];
					const optionsString = match.split('@options')[1];
					const options: string[] = JSON.parse(optionsString);
					message = message.replace(/@options{.+}/g, '');
					const blocks = createQuickReplyBlock(message, options);
					await webClient.chat.postMessage({
						channel: event.channel,
						text: '123',
						blocks,
					});
				}
				await webClient.chat.postMessage({
					channel: event.channel,
					text: message,
				});
			}
		}
	} catch (error) {
		console.log(error);
		throw error;
	}

	return Promise.resolve();
};

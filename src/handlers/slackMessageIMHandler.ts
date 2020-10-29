import { ISlackMessageIMEvent, ISLackProfile } from '../interfaces';
import { WebClient } from '@slack/web-api';
import DialogflowService from '../services/DialogflowService';
import { slackify } from '../utils/slackify';
import fs from 'fs';
import path from 'path';
import { createDiagram } from '../helpers/createDiagram';

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

			const response = await dialogflowService.processTextMessage(event.text, sessionId, email);
			let message = slackify(response, event);

			if (message.includes('@chart')) {
				console.log('got chart data');
				const chartData: { impact: number; probability: number } = JSON.parse(message.split('@chart')[1]);
				message = message.split('@chart')[0];
				const fileName = await createDiagram(chartData);
				const filePath = path.join(__dirname, fileName);
				await webClient.chat.postMessage({
					channel: event.channel,
					text: message,
				});
				await webClient.files.upload({
					title: 'My static file',
					file: fs.createReadStream(filePath),
					channels: event.channel,
				});
			} else {
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

import { IDetectIntentResponseData } from '../interfaces';
import SlackService from '../services/SlackService';

export async function defaultHandler(response: IDetectIntentResponseData, slackService: SlackService): Promise<void> {
	const messages: Array<string> = response.messages;
	const message = messages.join('\n');

	await slackService.postMessage(message);
}

import { IDetectIntentResponseData } from '../interfaces';
import SlackService from '../services/SlackService';

export async function handleDefaultIntents(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const message = response.messages.join('\n');

	await slackService.postMessage(message);
}

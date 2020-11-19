import { createMessageBlock } from '../slack/blocks/message';
import { IDetectIntentResponseData } from '../interfaces';
import SlackService from '../services/SlackService';

export async function handleGetTopFindings(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const messages = response.messages;

	const message = messages.join('\n');

	const blocks = createMessageBlock(message);

	await slackService.postMessage('', blocks);
}

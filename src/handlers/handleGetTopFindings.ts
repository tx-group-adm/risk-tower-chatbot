import { WebClient } from '@slack/web-api';
import { createMessageBlock } from '../slack/blocks/message';
import { IDetectIntentResponseData, ISlackMessageIMEvent } from '../interfaces';

export async function handleGetTopFindings(
	response: IDetectIntentResponseData,
	event: ISlackMessageIMEvent,
	webClient: WebClient
): Promise<void> {
	const messages = response.messages;

	const message = messages.join('\n');

	const blocks = createMessageBlock(message);

	await webClient.chat.postMessage({
		channel: event.channel,
		text: '',
		blocks,
	});
}

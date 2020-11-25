import { createMessageBlock } from '../slack/blocks/message';
import { IDetectIntentResponseData } from '../interfaces';
import SlackService from '../services/SlackService';
import { createQuickReplyBlock, getQuickReplyOptionsFor } from '../slack/blocks/quickReply';

export async function handleGetRisks(response: IDetectIntentResponseData, slackService: SlackService): Promise<void> {
	const allRequiredParamsPresent = response.allRequiredParamsPresent;
	const missingParameters = response.missingParameters;
	const messages = response.messages;

	const message = messages.join('\n');

	// check if slot filling is needed, if yes show quick reply block
	if (!allRequiredParamsPresent) {
		const options = getQuickReplyOptionsFor(missingParameters[0]);
		const blocks = createQuickReplyBlock(message, options);

		await slackService.postMessage('', blocks);

		return;
	}

	const blocks = createMessageBlock(message);

	await slackService.postMessage('', blocks);
}

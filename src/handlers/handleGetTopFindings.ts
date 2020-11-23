import { IDetectIntentResponseData, ITopFinding } from '../interfaces';
import SlackService from '../services/SlackService';
import { createQuickReplyBlock, getQuickReplyOptionsFor } from '../slack/blocks/quickReply';
import { createTopFindingsBlock } from '../slack/blocks/topFindings';

export async function handleGetTopFindings(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const findings = response.payload.findings as Array<ITopFinding>;
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

	const blocks = createTopFindingsBlock(message, findings);

	await slackService.postMessage('', blocks);
}

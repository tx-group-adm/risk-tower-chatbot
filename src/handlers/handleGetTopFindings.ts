import { IDetectIntentResponseData, ITopFinding } from '../interfaces';
import SlackService from '../services/SlackService';
import { createTopFindingsBlock } from '../slack/blocks/topFindings';

export async function handleGetTopFindings(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const findings = response.payload.findings as Array<ITopFinding>;
	const messages = response.messages;
	const message = messages.join('\n');

	const blocks = createTopFindingsBlock(message, findings);

	await slackService.postMessage('', blocks);
}

import { createTopMeasuresBlock } from '../slack/blocks/topMeasures';
import { IDetectIntentResponseData, ITopMeasure } from '../interfaces';
import SlackService from '../services/SlackService';

export async function handleGetTopMeasures(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const measures = response.payload.measures as Array<ITopMeasure>;
	const messages = response.messages;
	const message = messages.join('\n');

	const blocks = createTopMeasuresBlock(message, measures);

	await slackService.postMessage('', blocks);
}

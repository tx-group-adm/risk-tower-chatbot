import { createQuickReplyBlock, getQuickReplyOptionsFor } from '../slack/blocks/quickReply';
import { createDiagram } from '../helpers/createDiagram';
import { IAssessment, IDetectIntentResponseData, IParameter } from '../interfaces';
import SlackService from '../services/SlackService';

export async function handleGetAssessmentData(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const payload: IAssessment = (response.payload as unknown) as IAssessment;
	const messages: Array<string> = response.messages;
	const allRequiredParamsPresent: boolean = response.allRequiredParamsPresent;
	const missingParameters: Array<IParameter> = response.missingParameters;

	const message = messages.join('\n');

	// check if slot filling is needed, if yes show quick reply block
	if (!allRequiredParamsPresent) {
		const options = getQuickReplyOptionsFor(missingParameters[0]);
		const blocks = createQuickReplyBlock(message, options);

		await slackService.postMessage('', blocks);

		return;
	}

	// respond with assessment data
	await slackService.postMessage(message);

	if (payload.impact && payload.probability) {
		const chartData: { impact: number; probability: number } = {
			impact: payload.impact,
			probability: payload.probability,
		};
		const diagram = await createDiagram(chartData);

		await slackService.uploadFile(diagram);
	}
}

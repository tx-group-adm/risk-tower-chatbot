import { createQuickReplyBlock, getQuickReplyOptionsFor } from '../slack/blocks/quickReply';
import { IAssessment, IDetectIntentResponseData, IJiraTicket, IParameter } from '../interfaces';
import SlackService from '../services/SlackService';
import { createScatterChart } from '../slack/charts/scatterChart';
import { createAssessmentDataBlock } from '../slack/blocks/assessmentData';
import { createMessageBlock } from '../slack/blocks/message';

export async function handleGetAssessmentData(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const assessment = response.payload.assessment as IAssessment;
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

	if (assessment.impact && assessment.probability) {
		const url = await createScatterChart(assessment);
		const blocks = createAssessmentDataBlock(assessment.name, message, url);
		await slackService.postMessage('', blocks);
	} else {
		const blocks = createMessageBlock(message);
		await slackService.postMessage('', blocks);
	}
}

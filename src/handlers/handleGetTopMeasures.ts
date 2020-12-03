import { createTopMeasuresBlock } from '../slack/blocks/topMeasures';
import { IDetectIntentResponseData, IGetTopMeasuresParameters } from '../interfaces';
import SlackService from '../services/SlackService';
import { createQuickReplyBlock, getQuickReplyOptionsFor } from '../slack/blocks/quickReply';
import DataService from '../services/DataService';

export async function handleGetTopMeasures(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const parameters = response.parameters as IGetTopMeasuresParameters;
	const allRequiredParamsPresent = response.allRequiredParamsPresent;
	const missingParameters = response.missingParameters;

	// check if slot filling is needed, if yes show quick reply block
	if (!allRequiredParamsPresent) {
		const message = response.messages.join('\n');
		const options = getQuickReplyOptionsFor(missingParameters[0]);
		const blocks = createQuickReplyBlock(message, options);

		await slackService.postMessage('', blocks);

		return;
	}

	const type = parameters.tx_assessment_type;
	const email = await slackService.getEmailForUser();
	const roles = await DataService.getRolesForUser(email);

	const measures = await DataService.getTopMeasures(type, roles);

	if (measures.length == 0) {
		const noTopMeasuresMessage = `There are no ${type} measures available.`;
		await slackService.postMessage(noTopMeasuresMessage);
	} else {
		const topMeasuresMessage = `Top ${type} measures`;
		const blocks = createTopMeasuresBlock(topMeasuresMessage, measures);

		await slackService.postMessage('', blocks);
	}
}

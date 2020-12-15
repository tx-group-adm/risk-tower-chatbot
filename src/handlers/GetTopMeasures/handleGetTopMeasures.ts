import { createTopMeasuresBlock } from '../../slack/blocks/createTopMeasuresBlock';
import { IDetectIntentResponseData, IGetTopMeasuresParameters } from '../../interfaces';
import SlackService from '../../services/SlackService';
import DataService from '../../services/DataService';
import { showQuickReplies } from '..';

export async function handleGetTopMeasures(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const allRequiredParamsPresent = response.allRequiredParamsPresent;
	if (!allRequiredParamsPresent) {
		return await showQuickReplies(response, slackService);
	}

	const parameters = response.parameters as IGetTopMeasuresParameters;
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

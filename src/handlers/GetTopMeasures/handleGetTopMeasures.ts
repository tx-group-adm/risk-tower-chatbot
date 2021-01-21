import { createTopMeasuresBlock } from '../../slack/blocks/createTopMeasuresBlock';
import { IDetectIntentResponseData, IGetTopMeasuresParameters } from '../../interfaces';
import SlackService from '../../services/SlackService';
import DataService from '../../services/DataService';
import { showQuickReplies, userIsTopLevelAdmin } from '..';

export async function handleGetTopMeasures(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	let allRequiredParamsPresent = response.allRequiredParamsPresent;
	if (!allRequiredParamsPresent) {
		// set tx_assessment_type to 'security' if user is top level admin
		if (response.missingParameters.includes('tx_assessment_type')) {
			const email = await slackService.getEmailForUser();
			if (userIsTopLevelAdmin(email)) {
				response.parameters['tx_assessment_type'] = 'security';
				response.missingParameters.splice(response.missingParameters.indexOf('tx_assessment_type'), 1);
				if (response.missingParameters.length == 0) {
					allRequiredParamsPresent = true;
				}
			}
		}
		if (!allRequiredParamsPresent) {
			return showQuickReplies(response, slackService);
		}
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
		const blocks = createTopMeasuresBlock(topMeasuresMessage, measures, type);

		await slackService.postMessage('', blocks);
	}
}

import { showQuickReplies } from '..';
import { IDetectIntentResponseData, IGetTopFindingsParameters } from '../../interfaces';
import DataService from '../../services/DataService';
import SlackService from '../../services/SlackService';
import { createTopFindingsBlock } from '../../slack/blocks/createTopFindingsBlock';

export async function handleGetTopFindings(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const allRequiredParamsPresent = response.allRequiredParamsPresent;
	if (!allRequiredParamsPresent) {
		return showQuickReplies(response, slackService);
	}

	const parameters = response.parameters as IGetTopFindingsParameters;
	const type = parameters.tx_assessment_type;
	const email = await slackService.getEmailForUser();
	const roles = await DataService.getRolesForUser(email);

	const findings = await DataService.getTopFindings(type, roles);

	if (findings.length == 0) {
		const noTopFindingsMessage = `There are no ${type} findings available.`;
		await slackService.postMessage(noTopFindingsMessage);
	} else {
		const topFindingsMessage = `Top ${type} findings`;
		const blocks = createTopFindingsBlock(topFindingsMessage, findings, type);

		await slackService.postMessage('', blocks);
	}
}

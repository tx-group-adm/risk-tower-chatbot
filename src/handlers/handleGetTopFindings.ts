import { IDetectIntentResponseData, IGetTopFindingsParameters } from '../interfaces';
import DataService from '../services/DataService';
import SlackService from '../services/SlackService';
import { createQuickReplyBlock, getQuickReplyOptionsFor } from '../slack/blocks/quickReply';
import { createTopFindingsBlock } from '../slack/blocks/topFindings';

export async function handleGetTopFindings(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const parameters = response.parameters as IGetTopFindingsParameters;
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

	const findings = await DataService.getTopFindings(type, roles);

	const topFindingsMessage = `Top ${type} findings`;

	const blocks = createTopFindingsBlock(topFindingsMessage, findings);

	await slackService.postMessage('', blocks);
}

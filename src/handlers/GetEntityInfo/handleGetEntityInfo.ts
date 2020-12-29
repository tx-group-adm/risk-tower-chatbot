import { showQuickReplies } from '..';
import { ICompany, IDetectIntentResponseData, IGetEntityInfoParameters, IType } from '../../interfaces';
import DataService from '../../services/DataService';
import SlackService from '../../services/SlackService';
import { createEntityInfoBlock } from '../../slack/blocks/createEntityInfoBlock';

export async function handleGetEntityInfo(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const allRequiredParamsPresent = response.allRequiredParamsPresent;
	if (!allRequiredParamsPresent) {
		return showQuickReplies(response, slackService);
	}

	const parameters = response.parameters as IGetEntityInfoParameters;

	const type: IType = parameters.tx_assessment_type;
	const company: ICompany = parameters.tx_company;
	const email = await slackService.getEmailForUser();
	const roles = await DataService.getRolesForUser(email);

	const info = await DataService.getEntityInfo(type, roles, company);
	const blocks = createEntityInfoBlock(info);

	await slackService.postMessage('', blocks);
}

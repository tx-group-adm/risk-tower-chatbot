import { showQuickReplies } from '..';
import { ICompany, IDetectIntentResponseData, IGetRiskRatingsParameters, IType } from '../../interfaces';
import DataService from '../../services/DataService';
import SlackService from '../../services/SlackService';
import { createRiskRatingBlock } from '../../slack/blocks/createRiskRatingBlock';

export async function handleGetRiskRatings(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const allRequiredParamsPresent = response.allRequiredParamsPresent;
	if (!allRequiredParamsPresent) {
		return await showQuickReplies(response, slackService);
	}

	const parameters = response.parameters as IGetRiskRatingsParameters;
	const type: IType = parameters.tx_assessment_type;
	const company: ICompany = parameters.tx_company;
	const email = await slackService.getEmailForUser();
	const roles = await DataService.getRolesForUser(email);

	const riskRatingData = await DataService.getRiskRatings(type, company, roles);
	const blocks = createRiskRatingBlock(riskRatingData);

	await slackService.postMessage('', blocks);
}

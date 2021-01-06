import { showQuickReplies } from '..';
import { ICompany, IDetectIntentResponseData, IGetRiskRatingsParameters, IType, RiskArea } from '../../interfaces';
import DataService from '../../services/DataService';
import SlackService from '../../services/SlackService';
import { createRiskRatingBlock } from '../../slack/blocks/createRiskRatingBlock';

export async function handleGetRiskRatings(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const allRequiredParamsPresent = response.allRequiredParamsPresent;
	if (!allRequiredParamsPresent) {
		return showQuickReplies(response, slackService);
	}

	const parameters = response.parameters as IGetRiskRatingsParameters;
	const type: IType = parameters.tx_assessment_type;
	const company: ICompany = parameters.tx_company;
	const email = await slackService.getEmailForUser();
	const roles = await DataService.getRolesForUser(email);

	const riskRatingData = await DataService.getRiskRatings(type, company, roles);
	let areas: RiskArea[];
	if (riskRatingData && riskRatingData.assessment && riskRatingData.assessment.areas) {
		areas = Object.values(riskRatingData.assessment.areas);
	} else {
		areas = [];
	}
	const blocks = createRiskRatingBlock(areas);

	await slackService.postMessage('', blocks);
}

import { Button } from '@slack/web-api';
import { showQuickReplies } from '..';
import { ICompany, IDetectIntentResponseData, IGetRiskRatingsParameters, IType, RiskArea } from '../../interfaces';
import DataService from '../../services/DataService';
import SlackService from '../../services/SlackService';
import { createRiskRatingBlock } from '../../slack/blocks/createRiskRatingBlock';
import { createSwitchAsessmentButtons } from '../../slack/blocks/createSwitchAsessmentButtons';

export async function handleGetRiskRatings(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	if (!response.allRequiredParamsPresent) {
		return showQuickReplies(response, slackService);
	}

	const parameters = response.parameters as IGetRiskRatingsParameters;
	const type: IType = parameters.tx_assessment_type;
	const company: ICompany = parameters.tx_company;
	const email = await slackService.getEmailForUser();
	const roles = await DataService.getRolesForUser(email);

	console.log(`getting ${type} risk ratings for ${company}`);

	const riskAreas: RiskArea[] = await DataService.getRiskRatings(type, company, roles);
	const switchAssessmentButtons: Button[] = createSwitchAsessmentButtons(type, company, 'risk ratings');
	const blocks = createRiskRatingBlock(riskAreas, switchAssessmentButtons);

	await slackService.postMessage('', blocks);
}

import {
	IAssessment,
	ICompany,
	IDetectIntentResponseData,
	IGetRiskChartParameters,
	IRole,
	IType,
} from '../../interfaces';
import SlackService from '../../services/SlackService';
import { createScatterChart } from '../../slack/charts/scatterChart';
import { createAssessmentDataBlock } from '../../slack/blocks/createAssessmentDataBlock';
import DataService from '../../services/DataService';
import { AxiosError } from 'axios';
import RiskTowerService from '../../services/RiskTowerService';
import { Button } from '@slack/web-api';
import { createSwitchAsessmentButtons } from '../../slack/blocks/createSwitchAsessmentButtons';
import { showQuickReplies } from '..';

export async function handleGetRiskChart(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	if (!response.allRequiredParamsPresent) {
		return showQuickReplies(response, slackService);
	}

	const parameters = response.parameters as IGetRiskChartParameters;
	const email = await slackService.getEmailForUser();
	const roles: IRole[] = await DataService.getRolesForUser(email);
	const type: IType = parameters.tx_assessment_type;
	const company: ICompany = parameters.tx_company;

	try {
		const assessment: IAssessment = await DataService.getAssessmentData(type, roles, company);

		if (assessment.hasAssessment) {
			const assessmentMessage = `The ${type} risk chart for ${company} shows an impact of *${assessment.impact}* and a probability of *${assessment.probability}*`;
			const url = await createScatterChart(assessment);
			const parentName = await RiskTowerService.getParentName(assessment.parentId);
			const switchAssessmentButtons: Button[] = createSwitchAsessmentButtons(type, company, 'risk chart');
			const blocks = createAssessmentDataBlock(
				type,
				assessment.name,
				assessmentMessage,
				url,
				parentName,
				switchAssessmentButtons
			);
			await slackService.postMessage('', blocks);
		} else {
			const noAssessmentMessage = `Currently, there is no ${type} assessment data for ${company}.`;
			await slackService.postMessage(noAssessmentMessage);
		}
	} catch (err: unknown) {
		const errorMessage = (err as AxiosError).response?.data.message;
		if (errorMessage) {
			await slackService.postMessage(errorMessage);
		} else {
			await slackService.postMessage('Oops! Something went wrong, try again later.');
		}
	}
}

import { ICompany, IDetectIntentResponseData, IGetRisksParameters } from '../../interfaces';
import SlackService from '../../services/SlackService';
import RiskTowerService from '../../services/RiskTowerService';
import DataService from '../../services/DataService';
import { createBarChart } from '../../slack/charts/barChart';
import { createScatterChart } from '../../slack/charts/scatterChart';
import { createAssessmentDataBlock } from '../../slack/blocks/createAssessmentDataBlock';
import { createRisksBlock } from '../../slack/blocks/createRisksBlock';
import { createMessageBlock } from '../../slack/blocks/createMessageBlock';
import { showQuickReplies } from '..';

export async function handleGetRisks(response: IDetectIntentResponseData, slackService: SlackService): Promise<void> {
	const allRequiredParamsPresent = response.allRequiredParamsPresent;
	response.missingParameters.splice(response.missingParameters.indexOf('tx_company'), 1);
	if (!allRequiredParamsPresent) {
		return showQuickReplies(response, slackService);
	}

	const parameters = response.parameters as IGetRisksParameters;
	if (!parameters.tx_company) {
		const email = await slackService.getEmailForUser();
		const topLevelCompany: ICompany = await RiskTowerService.getTopLevelCompanyForUser(email);
		parameters.tx_company = topLevelCompany;
	}

	const type = parameters.tx_assessment_type;
	const company = parameters.tx_company;
	const email = await slackService.getEmailForUser();
	const roles = await DataService.getRolesForUser(email);

	const risks = await DataService.getRisks(type, company, roles);

	switch (risks.type) {
		case 'organisation':
			if (risks.children.length == 0) {
				const messageBlock = createMessageBlock(`There is no risk data for ${company}.`);
				await slackService.postMessage('', messageBlock);
				break;
			} else {
				const labels = risks.children.map((child) => child.name);
				const data = risks.children.map((child) => child.rating || 0);
				const backgroundColor = risks.children.map((child) => child.ratingColor || '#000000');
				const barChartUrl = await createBarChart(labels, data, backgroundColor);
				const organisationBlocks = createRisksBlock(type, company, barChartUrl, risks.children);
				await slackService.postMessage('', organisationBlocks);
				break;
			}

		case 'entity':
			const scatterChartUrl = await createScatterChart(risks.assessment);
			const assessmentMessage = `The ${type} chart for ${company} shows an impact of *${risks.assessment.impact}* and a probability of *${risks.assessment.probability}*.`;
			const entityBlocks = createAssessmentDataBlock(risks.assessment.name, assessmentMessage, scatterChartUrl);
			await slackService.postMessage('', entityBlocks);
			break;

		default:
			throw new Error(`unknown type`);
	}
}

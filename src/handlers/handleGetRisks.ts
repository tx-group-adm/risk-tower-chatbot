import { ICompany, IDetectIntentResponseData, IGetRisksParameters } from '../interfaces';
import SlackService from '../services/SlackService';
import { createQuickReplyBlock, getQuickReplyOptionsFor } from '../slack/blocks/quickReply';
import RiskTowerService from '../services/RiskTowerService';
import DataService from '../services/DataService';
import { createBarChart } from '../slack/charts/barChart';
import { createScatterChart } from '../slack/charts/scatterChart';
import { createAssessmentDataBlock } from '../slack/blocks/assessmentData';
import { createRisksBlock } from '../slack/blocks/risks';

export async function handleGetRisks(response: IDetectIntentResponseData, slackService: SlackService): Promise<void> {
	const parameters = response.parameters as IGetRisksParameters;
	const allRequiredParamsPresent = response.allRequiredParamsPresent;
	const missingParameters = response.missingParameters;
	const messages = response.messages;

	const message = messages.join('\n');

	// check if slot filling is needed, if yes show quick reply block
	if (!allRequiredParamsPresent) {
		const options = getQuickReplyOptionsFor(missingParameters[0]);
		const blocks = createQuickReplyBlock(message, options);

		await slackService.postMessage('', blocks);

		return;
	}

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
			const labels = risks.children.map((child) => child.name);
			const data = risks.children.map((child) => child.rating);
			const backgroundColor = risks.children.map((child) => child.ratingColor);
			const barChartUrl = await createBarChart(labels, data, backgroundColor);
			const organisationBlocks = createRisksBlock(type, company, barChartUrl, risks.children);
			await slackService.postMessage('', organisationBlocks);
			break;

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

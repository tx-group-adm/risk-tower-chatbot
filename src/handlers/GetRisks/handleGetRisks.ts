import { ICompany, IDetectIntentResponseData, IGetRisksParameters } from '../../interfaces';
import SlackService from '../../services/SlackService';
import RiskTowerService from '../../services/RiskTowerService';
import DataService from '../../services/DataService';
import { createBarChart } from '../../slack/charts/barChart';
import { createAssessmentDataBlock } from '../../slack/blocks/createAssessmentDataBlock';
import { createRisksBlock } from '../../slack/blocks/createRisksBlock';
import { createMessageBlock } from '../../slack/blocks/createMessageBlock';
import { showQuickReplies } from '..';
import { createSwitchAsessmentButtons } from '../../slack/blocks/createSwitchAsessmentButtons';
import { Button } from '@slack/web-api';
import { TreeItemNotFoundError } from '../../errors/TreeItemNotFoundError';
import { createSingleBarChart } from '../../slack/charts/singleBarChart';

export async function handleGetRisks(response: IDetectIntentResponseData, slackService: SlackService): Promise<void> {
	if (response.missingParameters.includes('tx_company')) {
		response.missingParameters.splice(response.missingParameters.indexOf('tx_company'), 1);
	}

	if (!response.allRequiredParamsPresent) {
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

	try {
		const risks = await DataService.getRisks(type, company, roles);

		console.log(risks);

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
					const parentId = risks.children[0].parentId;
					const grandParentName = await RiskTowerService.getGrandParentName(parentId);
					const organisationBlocks = createRisksBlock(type, company, barChartUrl, risks.children, grandParentName);
					await slackService.postMessage('', organisationBlocks);
					break;
				}

			case 'entity':
				const chartUrl = await createSingleBarChart(risks.assessment);
				const assessmentMessage = `The ${type} chart for ${company} shows an impact of *${risks.assessment.impact}* and a probability of *${risks.assessment.probability}*.`;
				const parentId = risks.assessment.parentId;
				const parentName = await RiskTowerService.getParentName(parentId);
				const switchAssessmentButtons: Button[] = createSwitchAsessmentButtons(type, company, 'risk chart');
				const entityBlocks = createAssessmentDataBlock(
					type,
					risks.assessment.name,
					assessmentMessage,
					chartUrl,
					parentName,
					switchAssessmentButtons
				);
				await slackService.postMessage('', entityBlocks);
				break;

			default:
				throw new Error(`unknown type`);
		}
	} catch (err) {
		if (err instanceof TreeItemNotFoundError) {
			const noRiksForCompanyMessage = `There are no ${type} risks for ${company} at the moment`;
			await slackService.postMessage(noRiksForCompanyMessage);
		} else {
			throw err;
		}
	}
}

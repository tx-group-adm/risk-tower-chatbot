import { Button } from '@slack/web-api';
import { showQuickReplies } from '..';
import { ICompany, IDetectIntentResponseData, IGetRiskEpicsParameters, IJiraTicket, IType } from '../../interfaces';
import DataService from '../../services/DataService';
import SlackService from '../../services/SlackService';
import { createJiraTicketsBlock } from '../../slack/blocks/createJiraTicketsBlock';
import { createSwitchAsessmentButtons } from '../../slack/blocks/createSwitchAsessmentButtons';

export async function handleGetRiskEpics(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	if (!response.allRequiredParamsPresent) {
		return showQuickReplies(response, slackService);
	}

	const parameters = response.parameters as IGetRiskEpicsParameters;
	const type: IType = parameters.tx_assessment_type;
	const company: ICompany = parameters.tx_company;

	const jiraTickets: IJiraTicket[] = await DataService.getJiraTickets(company, type);

	if (jiraTickets.length > 0) {
		const switchAssessmentButtons: Button[] = createSwitchAsessmentButtons(type, company, 'risk epics');
		const blocks = createJiraTicketsBlock(jiraTickets, switchAssessmentButtons);
		await slackService.postMessage('', blocks);
	} else {
		await slackService.postMessage(`There are no ${type} risk epics for ${company} at the moment.`);
	}
}

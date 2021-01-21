import { Button } from '@slack/web-api';
import { handleMissingParameters } from '..';
import { ICompany, IDetectIntentResponseData, IGetEntityInfoParameters, IType } from '../../interfaces';
import DataService from '../../services/DataService';
import SlackService from '../../services/SlackService';
import { createEntityInfoBlock } from '../../slack/blocks/createEntityInfoBlock';
import { createMessageBlock } from '../../slack/blocks/createMessageBlock';
import { createSwitchAsessmentButtons } from '../../slack/blocks/createSwitchAsessmentButtons';

export async function handleGetEntityInfo(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	if (!response.allRequiredParamsPresent) {
		const showingQuickReplies = await handleMissingParameters(response, slackService);
		if (showingQuickReplies) {
			return;
		}
	}

	const parameters = response.parameters as IGetEntityInfoParameters;

	const type: IType = parameters.tx_assessment_type;
	const company: ICompany = parameters.tx_company;
	const email = await slackService.getEmailForUser();
	const roles = await DataService.getRolesForUser(email);

	try {
		const info = await DataService.getEntityInfo(type, roles, company);
		const switchAssessmentButtons: Button[] = createSwitchAsessmentButtons(type, company, 'entity info');
		const blocks = createEntityInfoBlock(info, switchAssessmentButtons);

		await slackService.postMessage('', blocks);
	} catch (err) {
		const blocks = createMessageBlock(`There is no ${type} entity info available for ${company}.`);
		await slackService.postMessage('', blocks);
	}
}

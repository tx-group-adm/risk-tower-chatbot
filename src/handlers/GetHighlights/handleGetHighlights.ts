import { showDateDropdown, showQuickReplies } from '..';
import { IDetectIntentResponseData, IGetHighlightsParameters } from '../../interfaces';
import SlackService from '../../services/SlackService';

export async function handleGetHighlights(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	if (!response.allRequiredParamsPresent) {
		if (response.missingParameters[0] === 'tx_company') {
			return showQuickReplies(response, slackService);
		}
		return showDateDropdown(response, slackService);
	}

	console.log('GetHighlights parameters: ', JSON.stringify(response.parameters));

	const parameters = response.parameters as IGetHighlightsParameters;
	const company = parameters.tx_company;
	const date_time = parameters.date_time;

	await slackService.postMessage(`Get Highlights for ${company}, date_time: ${date_time}`);
}

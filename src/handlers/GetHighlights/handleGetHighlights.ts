import { showQuickReplies } from '..';
import { IDetectIntentResponseData, IGetHighlightsParameters } from '../../interfaces';
import SlackService from '../../services/SlackService';

export async function handleGetHighlights(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	if (!response.allRequiredParamsPresent) {
		return showQuickReplies(response, slackService);
	}

	console.log('GetHighlights parameters: ', JSON.stringify(response.parameters));

	const parameters = response.parameters as IGetHighlightsParameters;
	const company = parameters.tx_compamy;
	const date_time = parameters.date_time;

	await slackService.postMessage(`Get Highlights for ${company}, date_time: ${date_time}`);
}

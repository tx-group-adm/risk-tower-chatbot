import { showQuickReplies } from '..';
import { IDetectIntentResponseData, IGetIncidentsParameters } from '../../interfaces';
import SlackService from '../../services/SlackService';

export async function handleGetIncidents(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	if (!response.allRequiredParamsPresent) {
		return showQuickReplies(response, slackService);
	}

	console.log('GetIncidents parameters: ', JSON.stringify(response.parameters));

	const parameters = response.parameters as IGetIncidentsParameters;
	const company = parameters.tx_compamy;
	const date_time = parameters.date_time;

	await slackService.postMessage(`Get Incidents for ${company}, date_time: ${date_time}`);
}

import { showQuickReplies } from '..';
import { IDetectIntentResponseData, IGetNewsParameters } from '../../interfaces';
import SlackService from '../../services/SlackService';

export async function handleGetNews(response: IDetectIntentResponseData, slackService: SlackService): Promise<void> {
	if (!response.allRequiredParamsPresent) {
		return showQuickReplies(response, slackService);
	}

	console.log('GetNews parameters: ', JSON.stringify(response.parameters));

	const parameters = response.parameters as IGetNewsParameters;
	const company = parameters.tx_compamy;
	const date_time = parameters.date_time;

	await slackService.postMessage(`Get News for ${company}, date_time: ${date_time}`);
}

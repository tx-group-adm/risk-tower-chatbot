import { showDateDropdown, showQuickReplies } from '..';
import { DateTime, IDetectIntentResponseData, IGetIncidentsParameters } from '../../interfaces';
import DataService from '../../services/DataService';
import SlackService from '../../services/SlackService';
import { createIncidentsBlock } from '../../slack/blocks/createIncidentsBlock';
import { dateTimeToDateFilter } from '../../utils/date';

export async function handleGetIncidents(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	if (!response.allRequiredParamsPresent) {
		if (response.missingParameters[0] === 'tx_company') {
			return showQuickReplies(response, slackService);
		}
		return showDateDropdown(response, slackService);
	}

	console.log('GetIncidents parameters: ', JSON.stringify(response.parameters));

	const parameters = response.parameters as IGetIncidentsParameters;
	const company = parameters.tx_company;
	const date_time = parameters.date_time as DateTime;

	const dateFilter = dateTimeToDateFilter(date_time);
	const incidents = await DataService.getIncidents(company, dateFilter);
	const blocks = createIncidentsBlock(incidents, company, dateFilter);

	await slackService.postMessage('', blocks);
}

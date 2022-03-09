import { showDateDropdown, showQuickReplies } from '..';
import { DateTime, IDetectIntentResponseData, IGetHighlightsParameters } from '../../interfaces';
import DataService from '../../services/DataService';
import SlackService from '../../services/SlackService';
import { createHighlightsBlock } from '../../slack/blocks/createHighlightsBlock';
import { dateTimeToDateFilter } from '../../utils/date';

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
	const date_time = parameters.date_time as DateTime;

	const dateFilter = dateTimeToDateFilter(date_time);
	const highlights = await DataService.getHighlights(company, dateFilter);
	const blocks = createHighlightsBlock(highlights, company, dateFilter);

	await slackService.postMessage('', blocks);
}

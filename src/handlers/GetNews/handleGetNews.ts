import { showDateDropdown, showQuickReplies } from '..';
import { DateTime, IDetectIntentResponseData, IGetNewsParameters } from '../../interfaces';
import DataService from '../../services/DataService';
import SlackService from '../../services/SlackService';
import { createNewsBlock } from '../../slack/blocks/createNewsBlock';
import { dateTimeToDateFilter } from '../../utils/date';

export async function handleGetNews(response: IDetectIntentResponseData, slackService: SlackService): Promise<void> {
	if (!response.allRequiredParamsPresent) {
		if (response.missingParameters[0] === 'date_time') {
			return showDateDropdown(response, slackService);
		}
		return showQuickReplies(response, slackService);
	}

	console.log('GetNews parameters: ', JSON.stringify(response.parameters));

	const parameters = response.parameters as IGetNewsParameters;
	const company = parameters.tx_company;
	const date_time = parameters.date_time as DateTime;

	const dateFilter = dateTimeToDateFilter(date_time);

	console.log('date_time:', date_time, 'dateFilter:', dateFilter);

	const news = await DataService.getNews(company, dateFilter);
	const blocks = createNewsBlock(news, company, dateFilter);

	await slackService.postMessage('', blocks);
}

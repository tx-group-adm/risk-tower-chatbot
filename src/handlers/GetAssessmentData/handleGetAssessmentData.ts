import { showQuickReplies } from '..';
import { IDetectIntentResponseData, IGetAssessmentDataParameters } from '../../interfaces';
import SlackService from '../../services/SlackService';
import { handleGetEntityInfo } from '../GetEntityInfo/handleGetEntityInfo';
import { handleGetRiskChart } from '../GetRiskChart/handleGetRiskChart';
import { handleGetRiskEpics } from '../GetRiskEpics/handleGetRiskEpics';
import { handleGetRiskRatings } from '../GetRiskRatings/handleGetRiskRatings';

export async function handleGetAssessmentData(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	if (!response.allRequiredParamsPresent) {
		return showQuickReplies(response, slackService);
	}

	const parameters = response.parameters as IGetAssessmentDataParameters;
	const category = parameters.tx_assessment_category;

	switch (category) {
		case 'risk chart':
			await handleGetRiskChart(response, slackService);
			break;

		case 'entity info':
			await handleGetEntityInfo(response, slackService);
			break;

		case 'risk epics':
			await handleGetRiskEpics(response, slackService);
			break;

		case 'risk ratings':
			await handleGetRiskRatings(response, slackService);
			break;

		default:
			throw new Error('Unknown category');
	}
}

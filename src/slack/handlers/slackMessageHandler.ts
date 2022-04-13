import { HandlerResponse, ISlackMessageIMEvent } from '../../interfaces';
import DialogflowService from '../../services/DialogflowService';
import {
	INTENTS,
	handleGetRiskChart,
	handleGetGeneralHelp,
	handleGetRisks,
	handleGetTopFindings,
	handleGetTopMeasures,
} from '../../handlers';
import SlackService from '../../services/SlackService';
import { handleDefaultIntents } from '../../handlers/Default/handleDefaultIntents';
import { handleGetHelp } from '../../handlers/GetHelp/handleGetHelp';
import { handleGetAssessmentData } from '../../handlers/GetAssessmentData/handleGetAssessmentData';
import { handleGetEntityInfo } from '../../handlers/GetEntityInfo/handleGetEntityInfo';
import { handleGetRiskEpics } from '../../handlers/GetRiskEpics/handleGetRiskEpics';
import { handleGetRiskRatings } from '../../handlers/GetRiskRatings/handleGetRiskRatings';
import { errorHandler } from './errorHandler';
import { isUserTopLevelAdmin } from '../../handlers';
import { handleGetIncidents } from '../../handlers/GetIncidents/handleGetIncidents';
import { handleGetHighlights } from '../../handlers/GetHighlights/handleGetHighlights';
import { handleGetNews } from '../../handlers/GetNews/handleGetNews';
import { HTTP200, HTTP500 } from '../../responses';
import { handleUpdateCompanies } from '../../handlers/Update Companies/handleUpdateCompanies';

export async function slackMessageHandler(event: ISlackMessageIMEvent): Promise<HandlerResponse> {
	console.log('EVENT_CALLBACK');
	const { DIALOGFLOW_PROJECT_ID } = process.env;
	const slackService = new SlackService(event);
	const dialogflowService = new DialogflowService(DIALOGFLOW_PROJECT_ID as string);

	if (event.bot_id || event.upload) {
		console.log(`ignore event`);
		console.log(event);
		return HTTP200();
	}

	const sessionId = event.user;
	const response = await dialogflowService.processTextMessage(event.text, sessionId);
	const intentName = response.intentName;

	if (
		Object.keys(response.parameters).includes('tx_assessment_type') &&
		response.missingParameters.includes('tx_assessment_type')
	) {
		const email = await slackService.getEmailForUser();
		const userIsTopLevelAdmin = await isUserTopLevelAdmin(email);
		if (userIsTopLevelAdmin) {
			const fakeEvent = event;
			fakeEvent.text = 'security';
			return slackMessageHandler(fakeEvent);
		}
	}

	try {
		switch (intentName) {
			case INTENTS.GET_ASSESSMENT_DATA:
				await handleGetAssessmentData(response, slackService);
				break;

			case INTENTS.GET_RISK_CHART:
				await handleGetRiskChart(response, slackService);
				break;

			case INTENTS.GET_RISKS:
				await handleGetRisks(response, slackService);
				break;

			case INTENTS.GET_TOP_FINDINGS:
				await handleGetTopFindings(response, slackService);
				break;

			case INTENTS.GET_TOP_MEASURES:
				await handleGetTopMeasures(response, slackService);
				break;

			case INTENTS.GET_ENTITY_INFO:
				await handleGetEntityInfo(response, slackService);
				break;

			case INTENTS.GET_RISK_EPICS:
				await handleGetRiskEpics(response, slackService);
				break;

			case INTENTS.GET_RISK_RATINGS:
				await handleGetRiskRatings(response, slackService);
				break;

			case INTENTS.GET_INCIDENTS:
				await handleGetIncidents(response, slackService);
				break;

			case INTENTS.GET_HIGHLIGHTS:
				await handleGetHighlights(response, slackService);
				break;

			case INTENTS.GET_NEWS:
				await handleGetNews(response, slackService);
				break;

			case INTENTS.GET_GENERAL_HELP:
				await handleGetGeneralHelp(response, slackService);
				break;

			case INTENTS.UPDATE_COMPANIES:
				await handleUpdateCompanies(response, slackService);
				break;

			case INTENTS.GET_HELP_ASSESSMENT_FINDINGS_EPICS:
			case INTENTS.GET_HELP_BOARD_TYPE:
			case INTENTS.GET_HELP_ENTITY:
			case INTENTS.GET_HELP_KANBAN_BOARD:
			case INTENTS.GET_HELP_ORGANISATION:
			case INTENTS.GET_HELP_PREQUISITES:
			case INTENTS.GET_HELP_RISK_AREAS:
			case INTENTS.GET_HELP_RISK_TOWER:
			case INTENTS.GET_HELP_RISK_TYPE:
			case INTENTS.GET_HELP_SHOW_ASSESSMENT:
			case INTENTS.GET_HELP_SHOW_FINDINGS:
			case INTENTS.GET_HELP_SHOW_MEASURES:
			case INTENTS.GET_HELP_SHOW_RISKS:
			case INTENTS.GET_HELP_STORIES:
				await handleGetHelp(response, slackService);
				break;

			case INTENTS.DEFAULT_WELCOME:
			case INTENTS.DEFAULT_FALLBACK:
			case INTENTS.SMALL_TALK:
				await handleDefaultIntents(response, slackService);
				break;

			default:
				throw new Error(`No handler for intent: ${intentName}`);
		}

		return HTTP200();
	} catch (err) {
		const error = err as Error;
		console.log('error while handling intent, using error handler to notify user');
		console.log(error);
		await errorHandler(slackService);
		return HTTP500('Oops, something went wrong, check the logs for more information.');
	}
}

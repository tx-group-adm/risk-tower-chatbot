import { ISlackMessageIMEvent } from '../../interfaces';
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

export async function slackMessageHandler(event: ISlackMessageIMEvent): Promise<void> {
	const { DIALOGFLOW_PROJECT_ID } = process.env;
	const slackService = new SlackService(event);
	const dialogflowService = new DialogflowService(DIALOGFLOW_PROJECT_ID as string);

	if (event.bot_id || event.upload) {
		console.log(`ignore event`);
		console.log(event);
		return;
	}

	const sessionId = event.user;
	const response = await dialogflowService.processTextMessage(event.text, sessionId);
	const intentName = response.intentName;

	console.log(`missing parameters: ${JSON.stringify(response.missingParameters)}`);

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

			case INTENTS.GET_GENERAL_HELP:
				await handleGetGeneralHelp(response, slackService);
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
				await handleDefaultIntents(response, slackService);
				break;

			default:
				throw new Error(`No handler for intent: ${intentName}`);
		}
	} catch (err) {
		console.log('error while handling intent, using error handler to notify user');
		console.log(err);
		await errorHandler(slackService);
	}
}

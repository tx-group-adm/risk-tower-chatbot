import { ISlackMessageIMEvent } from '../../interfaces';
import DialogflowService from '../../services/DialogflowService';
import {
	INTENTS,
	handleGetAssessmentData,
	handleGetHelp,
	handleGetRisks,
	handleGetTopFindings,
	handleGetTopMeasures,
} from '../../handlers';
import SlackService from '../../services/SlackService';
import { defaultHandler } from '../../handlers/defaultHandler';

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
	const email = await slackService.getEmailForUser();
	const response = await dialogflowService.processTextMessage(event.text, sessionId, email);
	const intentName = response.intentName;

	switch (intentName) {
		case INTENTS.GET_ASSESSMENT_DATA:
			await handleGetAssessmentData(response, slackService);
			break;

		case INTENTS.GET_HELP:
			await handleGetHelp(response, slackService);
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

		case INTENTS.DEFAULT_WELCOME:
		case INTENTS.DEFAULT_FALLBACK:
			await defaultHandler(response, slackService);
			break;

		default:
			throw new Error(`No handler for intent: ${intentName}`);
	}
}

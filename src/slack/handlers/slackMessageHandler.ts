import { ISlackMessageIMEvent, ISLackProfile } from '../../interfaces';
import { WebClient } from '@slack/web-api';
import DialogflowService from '../../services/DialogflowService';
import {
	INTENTS,
	handleGetAssessmentData,
	handleGetHelp,
	handleGetRisks,
	handleGetTopFindings,
	handleGetTopMeasures,
} from '../../handlers';

export async function slackMessageHandler(event: ISlackMessageIMEvent): Promise<void> {
	const { DIALOGFLOW_PROJECT_ID, SLACK_BOT_TOKEN } = process.env;
	const dialogflowService = new DialogflowService(DIALOGFLOW_PROJECT_ID as string);
	const webClient = new WebClient(SLACK_BOT_TOKEN, { retryConfig: { retries: 0 } });

	if (event.bot_id || event.upload) {
		console.log(`ignore event`);
		console.log(event);
		return;
	}

	const sessionId = event.user;
	const email = (((await webClient.users.profile.get({
		user: event.user,
	})) as unknown) as ISLackProfile).profile.email;

	const response = await dialogflowService.processTextMessage(event.text, sessionId, email);
	const intentName = response.intentName;

	switch (intentName) {
		case INTENTS.GET_ASSESSMENT_DATA:
			await handleGetAssessmentData(response, event, webClient);
			break;

		case INTENTS.GET_HELP:
			await handleGetHelp(response, event, webClient);
			break;

		case INTENTS.GET_RISKS:
			await handleGetRisks(response, event, webClient);
			break;

		case INTENTS.GET_TOP_FINDINGS:
			await handleGetTopFindings(response, event, webClient);
			break;

		case INTENTS.GET_TOP_MEASURES:
			await handleGetTopMeasures(response, event, webClient);
			break;

		default:
			throw new Error(`No handler for intent: ${intentName}`);
	}
}

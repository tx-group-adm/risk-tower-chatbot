import { Struct, struct } from 'pb-util';
import { IDetectIntentResponseData, IParameter } from '../interfaces';
import { ClientOptions, DetectIntentRequest, SessionsClientV2 } from '../interfaces/dialogflow';
import { SessionsClient } from '@google-cloud/dialogflow';

export default class DialogflowService {
	private sessionClient: SessionsClientV2;
	private projectId: string;

	constructor(projectId: string) {
		const options: ClientOptions = {
			credentials: {
				private_key: (process.env.DIALOGFLOW_PRIVATE_KEY as string).replace(/\\n/gm, '\n'),
				client_email: process.env.DIALOGFLOW_CLIENT_EMAIL as string,
			},
		};

		this.projectId = projectId;
		this.sessionClient = new SessionsClient(options) as SessionsClientV2;
	}

	public async processTextMessage(
		message: string,
		sessionId: string,
		email: string
	): Promise<IDetectIntentResponseData> {
		const sessionPath = this.sessionClient.projectAgentSessionPath(this.projectId, sessionId);
		const request: DetectIntentRequest = {
			session: sessionPath,
			queryParams: {
				payload: {
					fields: {
						user: {
							stringValue: email,
						},
					},
				},
			},
			queryInput: {
				text: {
					text: message,
					languageCode: 'en-US',
				},
			},
		};

		try {
			const [response] = await this.sessionClient.detectIntent(request);
			console.log(JSON.stringify(response));
			const { queryResult } = response;
			const { fulfillmentMessages, webhookPayload, allRequiredParamsPresent, parameters, intent } = queryResult;
			const messages = fulfillmentMessages
				.map((msg) => msg.text?.text?.[0])
				.filter((msg) => msg !== undefined) as Array<string>;
			const payloadFields: Struct = webhookPayload
				? webhookPayload.fields?.data.structValue || ({} as Struct)
				: ({} as Struct);
			const payload = struct.decode(payloadFields);
			const paramData = struct.decode(parameters);
			const missingParameters = Object.keys(paramData).filter((key) => paramData[key] === '') as Array<IParameter>;
			const intentName = intent.displayName;
			return {
				messages,
				payload,
				allRequiredParamsPresent,
				missingParameters,
				intentName,
			};
		} catch (err) {
			console.log(err);
			throw new Error('Dialogflow Agent not available');
		}
	}
}

import { Struct, struct } from 'pb-util';
import { IDetectIntentResponseData, IParameter } from '../interfaces';
import { ClientOptions, DetectIntentRequest, SessionsClientv2 } from '../interfaces/dialogflow';
import { SessionsClient } from '@google-cloud/dialogflow';

export default class DialogflowService {
	private sessionClient: SessionsClientv2;
	private projectId: string;

	constructor(projectId: string) {
		const options: ClientOptions = {
			credentials: {
				private_key: (process.env.DIALOGFLOW_PRIVATE_KEY as string).replace(/\\n/gm, '\n'),
				client_email: process.env.DIALOGFLOW_CLIENT_EMAIL as string,
			},
		};

		this.projectId = projectId;
		this.sessionClient = new SessionsClient(options) as SessionsClientv2;
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
			const [{ queryResult }] = await this.sessionClient.detectIntent(request);
			const { fulfillmentMessages, webhookPayload, allRequiredParamsPresent, parameters } = queryResult;
			const fulfillmentMessage = fulfillmentMessages.map((msg) => msg.text?.text?.[0]).join('\n');
			const payloadFields: Struct = webhookPayload.fields?.data.structValue || ({} as Struct);
			const payload = struct.decode(payloadFields);
			const paramData = struct.decode(parameters);
			const missingParameters = Object.keys(paramData).filter((key) => paramData[key] === '') as Array<IParameter>;
			return {
				fulfillmentMessage,
				payload,
				allRequiredParamsPresent,
				missingParameters,
			};
		} catch (err) {
			console.log(err);
			throw new Error('Dialogflow Agent not available');
		}
	}
}

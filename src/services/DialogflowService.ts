import { ClientOptions } from 'google-gax/build/src/clientInterface';
import { GoogleAuthOptions } from 'google-auth-library/build/src/auth/googleauth';
import { Struct, struct } from 'pb-util';
import { v2 } from '@google-cloud/dialogflow';
import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { IDetectIntentResponseData } from '../interfaces';

export default class DialogflowService {
	private sessionClient: v2.SessionsClient;
	private projectId: string;

	constructor(projectId: string) {
		const options: GoogleAuthOptions = {
			credentials: {
				private_key: (process.env.DIALOGFLOW_PRIVATE_KEY as string).replace(/\\n/gm, '\n'),
				client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
			},
		};

		this.projectId = projectId;
		this.sessionClient = new v2.SessionsClient(options as ClientOptions);
	}

	public async processTextMessage(
		message: string,
		sessionId: string,
		email: string
	): Promise<IDetectIntentResponseData> {
		const sessionPath = this.sessionClient.projectAgentSessionPath(this.projectId, sessionId);
		const request: google.cloud.dialogflow.v2.IDetectIntentRequest = {
			session: sessionPath,
			queryInput: {
				text: {
					text: message,
					languageCode: 'en-US',
				},
			},
			queryParams: {
				payload: {
					fields: {
						user: {
							stringValue: email,
						},
					},
				},
			},
		};

		try {
			const [response] = await this.sessionClient.detectIntent(request);
			console.log(JSON.stringify(response));
			const fulfillmentMessage = response.queryResult?.fulfillmentMessages
				?.map((msg) => msg.text?.text?.[0])
				.join('\n');
			if (!fulfillmentMessage) {
				throw new Error('no fulfillment message');
			}
			const fields = response.queryResult?.webhookPayload?.fields?.data.structValue;
			const payload = fields ? struct.decode(fields as Struct) : {};
			return {
				fulfillmentMessage,
				payload,
			};
		} catch (err) {
			console.log(err);
			throw new Error('Dialogflow Agent not available');
		}
	}
}

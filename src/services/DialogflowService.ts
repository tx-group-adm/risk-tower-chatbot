import { ClientOptions } from 'google-gax/build/src/clientInterface';
import { GoogleAuthOptions } from 'google-auth-library/build/src/auth/googleauth';
import { Struct, struct } from 'pb-util';
import { v2 } from '@google-cloud/dialogflow';
import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { IDetectIntentResponseData, IParameter } from '../interfaces';

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
			const payloadFields = response.queryResult?.webhookPayload?.fields?.data.structValue;
			const payload = payloadFields ? struct.decode(payloadFields as Struct) : {};
			const allRequiredParamsPresent = !!response.queryResult?.allRequiredParamsPresent;
			const parameterFields = response.queryResult?.parameters;
			console.log(`parameter fields: ${JSON.stringify(parameterFields)}`);
			const parameterData = parameterFields ? struct.decode(parameterFields as Struct) : {};
			console.log(`parameter data: ${JSON.stringify(parameterData)}`);
			const missingParameters = Object.keys(parameterData).filter((key) => parameterData[key] !== '') as Array<
				IParameter
			>;
			console.log(`Missing parameters: ${JSON.stringify(missingParameters)}`);
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

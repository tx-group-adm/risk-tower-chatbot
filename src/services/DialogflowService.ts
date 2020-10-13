import { ClientOptions } from 'google-gax/build/src/clientInterface';
import { GoogleAuthOptions } from 'google-auth-library/build/src/auth/googleauth';

import { v2 } from '@google-cloud/dialogflow';
import { google } from '@google-cloud/dialogflow/build/protos/protos';

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

	private async makeRequest(
		message: string,
		sessionId: string,
		email: string
	): Promise<google.cloud.dialogflow.v2.IDetectIntentResponse[]> {
		console.log(`makeRequest was called with -> message: ${message} and sessionId: ${sessionId} for user ${email}`);

		const sessionPath = this.sessionClient.projectAgentSessionPath(this.projectId, sessionId);

		console.log(`sessionPath: ${sessionPath}`);

		const user: google.protobuf.IValue = {
			stringValue: email,
		};

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
						user,
					},
				},
			},
		};

		try {
			console.log(`sessionClient.detectIntent is being called...`);

			const response = await this.sessionClient.detectIntent(request);

			console.log(`detectIntent was successfully called`);

			if (response === undefined) {
				throw Error('Response from detectIntent is undefined');
			} else {
				console.log(`makeRequest returns following response: ${JSON.stringify(response)}`);

				return response as google.cloud.dialogflow.v2.IDetectIntentResponse[];
			}
		} catch (err) {
			console.log(err);

			throw new Error('Dialogflow Agent not available');
		}
	}

	async getIntentName(message: string, sessionId: string, email: string): Promise<string> {
		try {
			const response: google.cloud.dialogflow.v2.IDetectIntentResponse[] = await this.makeRequest(
				message,
				sessionId,
				email
			);

			if (!!response?.[0]?.queryResult?.intent?.displayName) {
				console.log(`response[0].queryResult.intent.displayName is available`);
				console.log(response[0].queryResult.intent.displayName);

				return response[0].queryResult.intent.displayName as string;
			} else {
				console.log(`response[0].queryResult.intent.displayName is NULL or UNDEFINED`);

				console.log(JSON.stringify(response));
				throw Error('The response from makeRequest is invalid, check the logs!');
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	async processTextMessage(message: string, sessionId: string, email: string): Promise<string> {
		try {
			const response = await this.makeRequest(message, sessionId, email);

			console.log(`processTextMessage succesfully called makeRequest`);

			console.log(`!!response?.[0]?.queryResult?.fulfillmentText = ${!!response?.[0]?.queryResult?.fulfillmentText}`);
			console.log(
				`response[0].queryResult.fulfillmentText = ${response?.[0]?.queryResult?.fulfillmentText || 'empty'}`
			);

			if (!!response?.[0]?.queryResult?.fulfillmentMessages?.length) {
				return response[0].queryResult.fulfillmentMessages.map((message) => message?.text?.text?.[0] ?? '').join('\n');
			} else {
				console.log(JSON.stringify(response));
				throw Error('The response from makeRequest is invalid, check the logs!');
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
}

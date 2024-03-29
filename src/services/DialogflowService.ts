import { struct } from 'pb-util';
import { IDetectIntentResponseData, IParameter } from '../interfaces';
import { ClientOptions, DetectIntentRequest, SessionsClientV2 } from '../interfaces/dialogflow';
import { SessionsClient } from '@google-cloud/dialogflow';
import { INTENTS } from '../handlers';

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

	public async processTextMessage(message: string, sessionId: string): Promise<IDetectIntentResponseData> {
		const sessionPath = this.sessionClient.projectAgentSessionPath(this.projectId, sessionId);
		const request: DetectIntentRequest = {
			session: sessionPath,
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
			const { fulfillmentMessages, allRequiredParamsPresent, parameters, intent } = queryResult;
			const messages = fulfillmentMessages
				.map((msg) => msg.text?.text?.[0])
				.filter((msg) => msg !== undefined) as Array<string>;

			const params = struct.decode(parameters) as { [index: string]: string };

			console.log('Dialogflow parameters: ', JSON.stringify(parameters));
			console.log('decoded params: ', JSON.stringify(params));

			const missingParameters = Object.keys(params)
				.filter((key) => {
					if (typeof params[key] === 'string') {
						return params[key].trim() === '';
					}
					return false;
				})
				.sort() as Array<IParameter>;

			if (intent.displayName === '') {
				intent.displayName = INTENTS.SMALL_TALK;
			}

			const intentName = intent.displayName;
			return {
				messages,
				parameters: params,
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

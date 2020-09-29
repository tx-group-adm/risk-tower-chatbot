import { google } from '@google-cloud/dialogflow/build/protos/protos';

export /**
 * Mock DetectIntentResponse for testing
 *
 * @returns {google.cloud.dialogflow.v2.IDetectIntentResponse[]}
 */
const mockDetectIntentResponse = (): google.cloud.dialogflow.v2.IDetectIntentResponse[] => {
	const mock: Partial<google.cloud.dialogflow.v2.IDetectIntentResponse> = {
		responseId: '',
		queryResult: {
			fulfillmentText: 'fulfillmentText',
			fulfillmentMessages: [
				{
					platform: 'PLATFORM_UNSPECIFIED',
					text: {
						text: ['Dialogflow answer'],
					},
				},
			],
			intent: {
				displayName: 'intentName',
			},
			languageCode: 'en-US',
			queryText: 'queryText',
		},
	};

	return [mock] as google.cloud.dialogflow.v2.IDetectIntentResponse[];
};

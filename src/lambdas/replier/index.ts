import {
	IEvent,
	ISlackEventCallback,
	ISlackUrlVerificationEvent,
	ISlackBlockActionsEvent,
	ISlackEvent,
	HandlerResponse,
} from '../../interfaces';
import { isSlackEvent } from '../../utils/isSlackEvent';
import * as AWS from 'aws-sdk';
import { InvocationRequest } from 'aws-sdk/clients/lambda';

const isJSON = (event: ISlackEvent): boolean => event.headers['Content-Type'] === 'application/json';

export async function handler(event: IEvent): Promise<HandlerResponse> {
	console.log(JSON.stringify(event));

	if (isSlackEvent(event)) {
		console.log(JSON.stringify(event));

		const slackEvent: ISlackUrlVerificationEvent | ISlackEventCallback | ISlackBlockActionsEvent = isJSON(event)
			? JSON.parse(event.body)
			: JSON.parse(decodeURIComponent(event.body.split('payload=')[1]));

		switch (slackEvent.type) {
			case 'url_verification':
				return {
					statusCode: 200,
					body: JSON.stringify({ challenge: (slackEvent as ISlackUrlVerificationEvent).challenge }),
				};

			case 'event_callback':
			case 'block_actions':
				const lambda = new AWS.Lambda();
				const functionName = `risk-tower-chatbot-${process.env.STAGE}-events-api`;
				const params: InvocationRequest = {
					FunctionName: functionName,
					InvocationType: 'Event',
					LogType: 'None',
					Payload: JSON.stringify(slackEvent),
				};
				await lambda.invoke(params).promise();
				return {
					statusCode: 200,
				};

			default:
				console.log(`No event type matched...`);
				return {
					statusCode: 400,
					body: JSON.stringify({ message: 'Invalid request: slack event type unknown' }),
				};
		}
	} else {
		console.log('Ignoring serverless-warmup event');
		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'warmup received' }),
		};
	}
}

import { HandlerResponse, ISlackEvent, ISlackEventCallback } from './src/interfaces';
import { slackMessageIMHandler } from './src/handlers/slackMessageIMHandler';

export const slackevent = (event: ISlackEvent): HandlerResponse => {
	console.log(JSON.stringify(event));
	const slackEvent: ISlackEventCallback = JSON.parse(event.body);
	console.log('EVENT_CALLBACK');
	console.log(JSON.stringify(slackEvent));
	slackMessageIMHandler(slackEvent.event);
	return {
		isBase64Encoded: false,
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json',
		},
		body: '',
	};
};

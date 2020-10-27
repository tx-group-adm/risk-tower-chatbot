import { HandlerResponse, IEvent, ISlackEventCallback } from './src/interfaces';
import { slackMessageIMHandler } from './src/handlers/slackMessageIMHandler';
import { isSlackEvent } from './src/helpers/isSlackEvent';

export const slackevent = (event: IEvent): HandlerResponse => {
	console.log(JSON.stringify(event));
	if (isSlackEvent(event)) {
		const slackEvent: ISlackEventCallback = JSON.parse(event.body);
		console.log('EVENT_CALLBACK');
		slackMessageIMHandler(slackEvent.event);
	} else {
		console.log('ignore serverless-warmup event');
	}

	return {
		isBase64Encoded: false,
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json',
		},
		body: '',
	};
};

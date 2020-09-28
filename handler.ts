import { Context } from 'aws-lambda';
import {
	HandlerResponse,
	ISlackMessageIMEvent,
	ISlackMessageEvent,
	IWarmupEvent,
	ISlackEvent,
	ISlackUrlVerificationEvent,
	ISlackEventCallback,
} from './src/interfaces';
import { isSlackEvent } from './src/handlers/helpers/isSlackEvent';
// import { slackMessageIMHandler } from './src/handlers/slackMessageIMHandler';
// import { errorHandler } from './src/handlers/errorHandler';

export const slackevent = (event: ISlackEvent | IWarmupEvent, context: Context): HandlerResponse => {
	context.callbackWaitsForEmptyEventLoop = false;

	if (isSlackEvent(event)) {
		const slackEvent: ISlackUrlVerificationEvent | ISlackEventCallback = JSON.parse(event.body);

		switch (slackEvent.type) {
			case 'url_verification':
				return {
					statusCode: 200,
					challenge: slackEvent.challenge,
				};

			case 'event_callback':
				console.log('event_callback');
				break;

			default:
				break;
		}
	}

	return {
		statusCode: 200,
		body: '',
		headers: {
			'Content-Type': 'application/json',
		},
	};
};

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
import { errorHandler } from './src/handlers/errorHandler';
// import { slackMessageIMHandler } from './src/handlers/slackMessageIMHandler';
// import { errorHandler } from './src/handlers/errorHandler';

export const slackevent = (event: ISlackEvent | IWarmupEvent, context: Context): HandlerResponse => {
	context.callbackWaitsForEmptyEventLoop = false;

	try {
		if (isSlackEvent(event)) {
			const slackEvent: ISlackUrlVerificationEvent | ISlackEventCallback = JSON.parse(event.body);

			switch (slackEvent.type) {
				case 'url_verification':
					console.log('URL_VERIFICATION');
					return {
						statusCode: 200,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ challenge: slackEvent.challenge }),
						isBase64Encoded: false,
					};

				case 'event_callback':
					console.log('EVENT_CALLBACK');
					break;

				default:
					break;
			}
		} else {
			console.log('WARMUP');
		}
	} catch (err) {
		errorHandler(err);
		throw err;
	}

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json',
		},
		isBase64Encoded: false,
	};
};

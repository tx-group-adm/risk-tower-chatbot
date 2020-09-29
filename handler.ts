import {
	HandlerResponse,
	IWarmupEvent,
	ISlackEvent,
	ISlackUrlVerificationEvent,
	ISlackEventCallback,
} from './src/interfaces';
import { isSlackEvent } from './src/handlers/helpers/isSlackEvent';
import { errorHandler } from './src/handlers/errorHandler';
import { slackMessageIMHandler } from './src/handlers/slackMessageIMHandler';

export const slackevent = async (event: ISlackEvent | IWarmupEvent): Promise<HandlerResponse> => {
	try {
		if (isSlackEvent(event)) {
			const slackEvent: ISlackUrlVerificationEvent | ISlackEventCallback = JSON.parse(event.body);

			switch (slackEvent.type) {
				case 'url_verification':
					console.log('URL_VERIFICATION');
					return {
						isBase64Encoded: false,
						statusCode: 200,
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ challenge: slackEvent.challenge }),
					};

				case 'event_callback':
					console.log('EVENT_CALLBACK');
					console.log(JSON.stringify(slackEvent));
					await slackMessageIMHandler(slackEvent.event);
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
		isBase64Encoded: false,
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json',
		},
		body: '',
	};
};

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

			console.log(`typeof slackEvent: ${typeof slackEvent}`);

			console.log(JSON.stringify(event));

			if (slackEvent.type === 'url_verification') {
				console.log('URL_VERIFICATION');
				return {
					isBase64Encoded: false,
					statusCode: 200,
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ challenge: slackEvent.challenge }),
				};
			} else if (slackEvent.type === 'event_callback') {
				console.log('EVENT_CALLBACK');
				console.log(JSON.stringify(slackEvent));
				await slackMessageIMHandler(slackEvent.event);
				return {
					isBase64Encoded: false,
					statusCode: 200,
					headers: {
						'Content-Type': 'application/json',
					},
					body: '',
				};
			} else {
				console.log('INVALID EVENT');

				console.log(JSON.stringify(event));
				return {
					isBase64Encoded: false,
					statusCode: 500,
					headers: {
						'Content-Type': 'application/json',
					},
					body: 'Invalid event',
				};
			}
		} else {
			console.log('WARMUP EVENT');
			console.log(JSON.stringify(event));
			return {
				isBase64Encoded: false,
				statusCode: 200,
				headers: {
					'Content-Type': 'application/json',
				},
				body: '',
			};
		}
	} catch (err) {
		errorHandler(err);
		throw err;
	}
};

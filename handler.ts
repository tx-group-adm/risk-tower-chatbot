import { HandlerResponse, ISlackEvent, ISlackEventCallback } from './src/interfaces';
import { errorHandler } from './src/handlers/errorHandler';
import { slackMessageIMHandler } from './src/handlers/slackMessageIMHandler';

export const slackevent = async (event: ISlackEvent): Promise<HandlerResponse> => {
	try {
		const slackEvent: ISlackEventCallback = JSON.parse(event.body);
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
	} catch (err) {
		errorHandler(err);
		throw err;
	}
};

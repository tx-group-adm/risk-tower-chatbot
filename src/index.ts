import { HandlerResponse, ISlackMessageIMEvent } from './interfaces';
import { slackMessageIMHandler } from './handlers/slackMessageIMHandler';
import { errorHandler } from './handlers/errorHandler';

export const handler = (event: { body: string }): HandlerResponse => {
	try {
		console.log(`Received event: ${JSON.stringify(event)}`);
		const slackEvent = JSON.parse(event.body) as ISlackMessageIMEvent;
		slackMessageIMHandler(slackEvent);
	} catch (err) {
		errorHandler(err, err.message);
	}

	return {
		statusCode: 200,
		body: '',
		headers: {
			'Content-Type': 'application/json',
		},
	};
};

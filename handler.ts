import { Context } from 'aws-lambda';
import { HandlerResponse, ISlackMessageIMEvent } from './src/interfaces';
import { slackMessageIMHandler } from './src/handlers/slackMessageIMHandler';
import { errorHandler } from './src/handlers/errorHandler';

export const slackevent = (event: { body: string }, context: Context): HandlerResponse => {
	try {
		context.callbackWaitsForEmptyEventLoop = false;
		console.log(`Received event: ${JSON.stringify(event)}`);
		console.log('v1.0 works');

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

import { Context } from 'aws-lambda';
import { HandlerResponse, ISlackMessageIMEvent } from './src/interfaces';
import { slackMessageIMHandler } from './src/handlers/slackMessageIMHandler';
import { errorHandler } from './src/handlers/errorHandler';

export const slackevent = (event: { body: string }, context: Context): HandlerResponse => {
	if (JSON.parse(event.body).type === 'url_verification') {
		console.log('url_verification event');
		console.log(JSON.stringify(event.body));

		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'application/json',
			},
			body: '',
			challenge: JSON.parse(event.body).challenge,
		};
	} else {
		try {
			context.callbackWaitsForEmptyEventLoop = false;
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
	}
};

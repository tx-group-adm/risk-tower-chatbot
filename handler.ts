import { Context } from 'aws-lambda';
import { HandlerResponse, ISlackMessageIMEvent } from './src/interfaces';
import { slackMessageIMHandler } from './src/handlers/slackMessageIMHandler';
import { errorHandler } from './src/handlers/errorHandler';

export const slackevent = (event: { body: string }, context: Context): HandlerResponse => {
	const _event = JSON.parse(event.body);

	if (_event.hasOwnProperty('type') && _event.type === 'url_verification') {
		console.log('url_verification event');
		console.log(JSON.stringify(_event));

		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'application/json',
			},
			challenge: _event.challenge,
		};
	} else {
		try {
			context.callbackWaitsForEmptyEventLoop = false;
			console.log(`Received event: ${JSON.stringify(_event)}`);
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

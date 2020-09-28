import { Context } from 'aws-lambda';
import { HandlerResponse, ISlackMessageIMEvent, ISlackMessageEvent, IWarmupEvent } from './src/interfaces';
// import { slackMessageIMHandler } from './src/handlers/slackMessageIMHandler';
// import { errorHandler } from './src/handlers/errorHandler';

export const slackevent = (event: { body: string }, context: Context): HandlerResponse => {
	context.callbackWaitsForEmptyEventLoop = false;

	const slackEvent: ISlackMessageEvent | IWarmupEvent = JSON.parse(event.body);

	console.log(slackEvent);

	return {
		statusCode: 200,
		body: '',
		headers: {
			'Content-Type': 'application/json',
		},
	};
};

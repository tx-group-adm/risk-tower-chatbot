import { HandlerResponse, IEvent, ISlackEventCallback } from './src/interfaces';
import { slackMessageIMHandler } from './src/handlers/slackMessageIMHandler';
import { isSlackEvent } from './src/helpers/isSlackEvent';
import { HTTP200 } from './src/responses';
import { Callback, Context } from 'aws-lambda';

export const slackevent = (event: IEvent, context: Context, callback: Callback): void => {
	console.log(JSON.stringify(event));
	if (isSlackEvent(event)) {
		console.log('EVENT_CALLBACK');
		const slackEvent: ISlackEventCallback = JSON.parse(event.body);
		slackMessageIMHandler(slackEvent.event);
		return callback(null, HTTP200());
	} else {
		return callback(null, HTTP200('warmup received'));
	}
};

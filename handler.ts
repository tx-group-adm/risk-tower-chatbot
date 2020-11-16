import { IEvent, ISlackEventCallback } from './src/interfaces';
import { slackMessageHandler } from './src/slack/handlers/slackMessageHandler';
import { isSlackEvent } from './src/slack/isSlackEvent';
import { HTTP200, HTTP500 } from './src/responses';
import { Callback, Context } from 'aws-lambda';

export const slackevent = (event: IEvent, context: Context, callback: Callback): void => {
	try {
		console.log(JSON.stringify(event));
		if (isSlackEvent(event)) {
			console.log('EVENT_CALLBACK');
			const slackEvent: ISlackEventCallback = JSON.parse(event.body);
			slackMessageHandler(slackEvent.event);
			return callback(null, HTTP200());
		} else {
			return callback(null, HTTP200('warmup received'));
		}
	} catch (err) {
		return callback(err, HTTP500(err.message));
	}
};

import { IEvent, ISlackEventCallback, ISlackEventOnUsersBehalf } from './src/interfaces';
import { slackMessageHandler } from './src/slack/handlers/slackMessageHandler';
import { isSlackEvent } from './src/slack/isSlackEvent';
import { isEventCallback } from './src/slack/isEventCallback';
import { HTTP200, HTTP500 } from './src/responses';
import { Callback, Context } from 'aws-lambda';
import { sendMessageOnUsersBehalf } from './src/slack/handlers/sendMessageOnUsersBehalf';

export const slackevent = (event: IEvent, context: Context, callback: Callback): void => {
	try {
		console.log(JSON.stringify(event));
		if (isSlackEvent(event)) {
			const slackEvent: ISlackEventCallback | ISlackEventOnUsersBehalf = JSON.parse(event.body);
			if (!isEventCallback(slackEvent)) {
				console.log('EVENT_ON_USERS_BEHALF');
				sendMessageOnUsersBehalf(slackEvent.event);
			}
			console.log('EVENT_CALLBACK');
			slackMessageHandler(slackEvent.event);
		}
		return callback(null, HTTP200());
	} catch (err) {
		return callback(err, HTTP500(err.message));
	}
};

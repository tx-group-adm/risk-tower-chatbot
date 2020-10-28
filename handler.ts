import { HandlerResponse, IEvent, ISlackEventCallback } from './src/interfaces';
import { slackMessageIMHandler } from './src/handlers/slackMessageIMHandler';
import { isSlackEvent } from './src/helpers/isSlackEvent';
import { HTTP200 } from './src/responses';

export const slackevent = (event: IEvent): HandlerResponse => {
	console.log(JSON.stringify(event));
	if (isSlackEvent(event)) {
		console.log('EVENT_CALLBACK');
		const slackEvent: ISlackEventCallback = JSON.parse(event.body);
		slackMessageIMHandler(slackEvent.event);
		return HTTP200();
	} else {
		return HTTP200('warmup received');
	}
};

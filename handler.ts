import { HandlerResponse, IEvent, ISlackEventCallback } from './src/interfaces';
import { slackMessageIMHandler } from './src/handlers/slackMessageIMHandler';
import { isSlackEvent } from './src/helpers/isSlackEvent';
import { HTTP200 } from './src/responses';

export const slackevent = async (event: IEvent): Promise<HandlerResponse> => {
	console.log(JSON.stringify(event));
	if (isSlackEvent(event)) {
		console.log('EVENT_CALLBACK');
		const slackEvent: ISlackEventCallback = JSON.parse(event.body);
		await slackMessageIMHandler(slackEvent.event);
		return HTTP200();
	} else {
		return HTTP200('warmup received');
	}
};

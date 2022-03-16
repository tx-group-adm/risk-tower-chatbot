import { HandlerResponse, SlackEventType } from './src/interfaces';
import { slackMessageHandler } from './src/slack/handlers/slackMessageHandler';
import { slackBlockActionsHandler } from './src/slack/handlers/slackBlockActionsHandler';

export async function slackevent(slackEvent: SlackEventType): Promise<HandlerResponse> {
	console.log(JSON.stringify(slackEvent));

	switch (slackEvent.type) {
		case 'event_callback':
			return slackMessageHandler(slackEvent.event);

		case 'block_actions':
			return slackBlockActionsHandler(slackEvent);
	}
}

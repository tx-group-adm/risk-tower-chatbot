import { HandlerResponse, SlackEventType } from '../../interfaces';
import { slackMessageHandler } from '../../slack/handlers/slackMessageHandler';
import { slackBlockActionsHandler } from '../../slack/handlers/slackBlockActionsHandler';

export async function handler(slackEvent: SlackEventType): Promise<HandlerResponse> {
	console.log(JSON.stringify(slackEvent));

	switch (slackEvent.type) {
		case 'event_callback':
			return slackMessageHandler(slackEvent.event);

		case 'block_actions':
			return slackBlockActionsHandler(slackEvent);
	}
}

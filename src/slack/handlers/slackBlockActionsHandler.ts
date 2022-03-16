import { BlockAction, HandlerResponse, ISlackBlockActionsEvent, ISlackMessageIMEvent } from '../../interfaces';
import { HTTP200 } from '../../responses';
import { slackMessageHandler } from './slackMessageHandler';

export async function slackBlockActionsHandler(event: ISlackBlockActionsEvent): Promise<HandlerResponse> {
	await Promise.all(
		event.actions.map(async (action: BlockAction) => {
			switch (action.action_id) {
				case 'quickreply': {
					const messageEvent: ISlackMessageIMEvent = {
						channel: event.channel.id,
						text: action.value,
						user: event.user.id,
						type: 'message',
						channel_type: 'im',
						event_ts: '',
						ts: '',
					};
					await slackMessageHandler(messageEvent);
					break;
				}

				case 'date_dropdown': {
					const messageEvent: ISlackMessageIMEvent = {
						channel: event.channel.id,
						text: action.value,
						user: event.user.id,
						type: 'message',
						channel_type: 'im',
						event_ts: '',
						ts: '',
					};
					await slackMessageHandler(messageEvent);
					break;
				}

				default:
					console.error(`Unknown action_id: ${action.action_id}`);
					break;
			}
		})
	);

	return HTTP200();
}

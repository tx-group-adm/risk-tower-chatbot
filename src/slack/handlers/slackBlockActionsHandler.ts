import {
	BlockAction,
	ButtonBlockAction,
	HandlerResponse,
	ISlackBlockActionsEvent,
	ISlackMessageIMEvent,
	StaticSelectBlockAction,
} from '../../interfaces';
import { slackMessageHandler } from './slackMessageHandler';

export async function slackBlockActionsHandler(event: ISlackBlockActionsEvent): Promise<HandlerResponse> {
	event.actions.map((action: BlockAction) => {
		if (action.action_id.startsWith('quickreply')) {
			action.action_id = 'quickreply';
		}
		return action;
	});
	await Promise.all(
		event.actions.map(async (action: BlockAction) => {
			switch (action.action_id) {
				case 'quickreply': {
					const messageEvent: ISlackMessageIMEvent = {
						channel: event.channel.id,
						text: (action as ButtonBlockAction).value.replace('+', ' '),
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
						text: (action as StaticSelectBlockAction).selected_option.value.replace('+', ' '),
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

	return {
		statusCode: 200,
	};
}

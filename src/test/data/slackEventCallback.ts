import { ISlackEventCallback } from '../../interfaces';
import { mockSlackMessageIMEvent } from './slackMessageIMEvent';

const event = mockSlackMessageIMEvent();

export const mockSlackEventCallback = (): ISlackEventCallback => {
	return {
		event,
		type: 'event_callback',
		api_app_id: '',
		authed_users: [],
		event_id: '',
		event_time: 0,
		team_id: '',
		token: '',
	};
};

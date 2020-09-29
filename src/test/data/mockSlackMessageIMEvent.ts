import { ISlackMessageIMEvent } from '../../interfaces';

export const mockSlackMessageIMEvent = (type = 'message'): ISlackMessageIMEvent => {
	return {
		channel: 'my-channel',
		user: 'Testuser123',
		text: 'Dear __user__, welcome to the channel __channel__!',
		channel_type: 'im',
		event_ts: '',
		ts: '',
		type,
	};
};

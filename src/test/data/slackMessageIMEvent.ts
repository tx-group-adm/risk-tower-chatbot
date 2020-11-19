import { ISlackMessageIMEvent } from '../../interfaces';

export const mockSlackMessageIMEvent = (
	text = '',
	user = '',
	bot_id?: string,
	upload?: boolean
): ISlackMessageIMEvent => {
	return {
		text,
		user,
		bot_id,
		upload,
		channel_type: 'im',
		type: 'message',
		channel: '',
		event_ts: '',
		ts: '',
	};
};

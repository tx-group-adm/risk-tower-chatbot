import { KnownBlock } from '@slack/web-api';

export const createMessageBlock = (message: string): Array<KnownBlock> => {
	return [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: message,
			},
		},
	];
};

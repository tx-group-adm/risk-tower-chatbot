import { Button, KnownBlock } from '@slack/web-api';

export const createQuickReplyBlock = (message: string, options: string[]): KnownBlock[] => {
	return [
		{
			type: 'section',
			text: {
				type: 'plain_text',
				text: message,
			},
		},
		{
			type: 'actions',
			block_id: 'quickreplyblock',
			elements: options.map(
				(option): Button => ({
					type: 'button',
					text: {
						type: 'plain_text',
						text: option,
					},
					value: option,
				})
			),
		},
	];
};

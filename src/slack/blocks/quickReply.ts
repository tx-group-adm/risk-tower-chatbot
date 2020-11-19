import { Button, KnownBlock } from '@slack/web-api';
import { IParameter } from '../../interfaces';

const QUICKREPLIES: {
	[index: string]: Array<string>;
} = {
	tx_company: ['20 Minuten', 'Doodle', 'Ricardo', 'Tamedia', 'Tutti'],
	tx_assessment_type: ['compliance', 'privacy', 'security', 'soc2', 'technology'],
};

export const getQuickReplyOptionsFor = (parameter: IParameter): Array<string> => QUICKREPLIES[parameter];

export const createQuickReplyBlock = (message: string, options: Array<string>): Array<KnownBlock> => {
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
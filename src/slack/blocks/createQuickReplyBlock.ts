import { Button, KnownBlock } from '@slack/web-api';
import { ICategory, ICompany, IParameter, IType } from '../../interfaces';

const QUICKREPLIES: {
	tx_company: ICompany[];
	tx_assessment_type: IType[];
	tx_assessment_category: ICategory[];
} = {
	tx_company: ['20 Minuten', 'IT', 'Goldbach', 'Corporate Services', 'Technology Services'],
	tx_assessment_type: ['privacy', 'security', 'technology'],
	tx_assessment_category: ['entity info', 'risk chart', 'risk ratings', 'risk epics'],
};

export const getQuickReplyOptionsFor = (parameter: IParameter): Array<string> => {
	console.log('getting quickreply options for ' + parameter);
	return QUICKREPLIES[parameter];
};

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
			type: 'divider',
		},
		{
			type: 'actions',
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

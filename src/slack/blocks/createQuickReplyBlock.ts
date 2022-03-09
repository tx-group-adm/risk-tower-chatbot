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

export const createDateDropdownBlock = (message: string): KnownBlock[] => {
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
			elements: [
				{
					type: 'static_select',
					placeholder: {
						type: 'plain_text',
						text: 'Choose a time sspan',
					},
					options: [
						{
							text: {
								type: 'plain_text',
								text: 'Current month',
							},
							value: 'current_month',
						},
						{
							text: {
								type: 'plain_text',
								text: 'Last month',
							},
							value: 'last_month',
						},
						{
							text: {
								type: 'plain_text',
								text: 'Current year',
							},
							value: 'current_year',
						},
						{
							text: {
								type: 'plain_text',
								text: 'Last year',
							},
							value: 'last_year',
						},
					],
					action_id: 'actionId-3',
				},
			],
		},
	];
};

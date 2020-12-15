import { KnownBlock } from '@slack/web-api';

import { ENTITY, WORKFLOW } from './data';

export function createHelpMessageBlock(message: string): KnownBlock[] {
	return [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: message,
			},
		},
		...createHelpMessageMenu(),
	];
}

export function createHelpMessageMenu(): KnownBlock[] {
	return [
		{
			type: 'actions',
			elements: [
				{
					type: 'static_select',
					placeholder: {
						type: 'plain_text',
						text: 'Select a help topic...',
					},
					option_groups: [
						{
							label: {
								type: 'plain_text',
								text: 'Working with Risk Tower',
							},
							options: WORKFLOW.map((question) => ({
								text: {
									type: 'plain_text',
									text: question,
								},
								value: question,
							})),
						},
						{
							label: {
								type: 'plain_text',
								text: 'The Risk Tower',
							},
							options: ENTITY.map((question) => ({
								text: {
									type: 'plain_text',
									text: question,
								},
								value: question,
							})),
						},
					],
				},
			],
		},
	];
}

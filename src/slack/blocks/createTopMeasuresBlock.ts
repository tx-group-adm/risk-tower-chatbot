import { ITopMeasure, IType } from '../../interfaces';
import { KnownBlock, SectionBlock } from '@slack/web-api';
import { createTopMeasuresText } from './data/shared';

export function createTopMeasuresBlock(title: string, measures: Array<ITopMeasure>, type: IType): Array<KnownBlock> {
	const blocks: Array<KnownBlock> = [
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: title,
			},
		},
		{
			type: 'divider',
		},
		...measures.map(
			(item): SectionBlock => {
				const text = createTopMeasuresText(item);

				return {
					type: 'section',
					text: {
						type: 'mrkdwn',
						text,
					},
				};
			}
		),
		{
			type: 'divider',
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `Do you want to see the top ${type} findings too?`,
			},
		},
		{
			type: 'actions',
			elements: [
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: 'Yes!',
					},
					value: `Show me the top ${type} findings.`,
					style: 'primary',
				},
			],
		},
	];

	return blocks;
}

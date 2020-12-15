import { ITopMeasure } from '../../interfaces';
import { KnownBlock } from '@slack/web-api';

export function createTopMeasuresBlock(title: string, findings: Array<ITopMeasure>): Array<KnownBlock> {
	const blocks: Array<KnownBlock> = [
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: title,
			},
		},
	];

	findings.forEach((item) => {
		blocks.push({
			type: 'divider',
		});
		blocks.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: item[0],
			},
		});
	});

	return blocks;
}

import { ITopFinding } from '../../interfaces';
import { KnownBlock } from '@slack/web-api';

export function createTopFindingsBlock(title: string, findings: Array<ITopFinding>): Array<KnownBlock> {
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

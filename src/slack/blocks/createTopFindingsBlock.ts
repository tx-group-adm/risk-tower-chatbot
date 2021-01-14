import { ITopFinding, IType } from '../../interfaces';
import { KnownBlock } from '@slack/web-api';

export function createTopFindingsBlock(title: string, findings: Array<ITopFinding>, type: IType): Array<KnownBlock> {
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
	];

	findings.forEach((item) => {
		blocks.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `*${item[0]}*`,
			},
		});
	});

	blocks.push({
		type: 'divider',
	});

	blocks.push({
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: `Do you want to see the top ${type} measures too?`,
		},
	});

	blocks.push({
		type: 'actions',
		elements: [
			{
				type: 'button',
				text: {
					type: 'plain_text',
					text: 'Yes!',
				},
				value: `Show me the top ${type} measures.`,
				style: 'primary',
			},
		],
	});

	return blocks;
}

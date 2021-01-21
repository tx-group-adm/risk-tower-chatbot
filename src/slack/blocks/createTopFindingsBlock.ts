import { ITopFinding, IType } from '../../interfaces';
import { KnownBlock, SectionBlock } from '@slack/web-api';
import { getRiskLevelEmojiByCriticality } from './data/emoji';

function createTopFindingsText(item: ITopFinding): string {
	const riskLevelEmoji = getRiskLevelEmojiByCriticality(item[1].criticality);
	const textValue = item[0];
	const configName = item[1].configName[0];

	const text = `${riskLevelEmoji} *${textValue}* _(${configName})_`;

	return text;
}

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
		...findings.map(
			(item): SectionBlock => {
				const text = createTopFindingsText(item);

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
				text: `Do you want to see the top ${type} measures too?`,
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
					value: `Show me the top ${type} measures.`,
					style: 'primary',
				},
			],
		},
	];

	return blocks;
}

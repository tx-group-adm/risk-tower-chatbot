import { KnownBlock, SectionBlock } from '@slack/web-api';
import { RiskArea } from '../../interfaces';

export function createRiskRatingBlock(areas: RiskArea[]): KnownBlock[] {
	const blocks: KnownBlock[] = [
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: 'Risk ratings',
			},
		},
		{
			type: 'divider',
		},
	];

	if (areas.length == 0) {
		const messageBlock: SectionBlock = {
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: 'There are no risk ratings available at the moment.',
			},
		};
		blocks.push(messageBlock);
	} else {
		areas.forEach((area) => {
			const ratingBlock: SectionBlock = {
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `*${area.config.name}:* ${area.config.ratings[0].areaAssessment}`,
				},
			};
			blocks.push(ratingBlock);
		});
	}

	return blocks;
}

import { KnownBlock, SectionBlock } from '@slack/web-api';
import { RiskRatingData } from '../../interfaces';

export function createRiskRatingBlock(riskRatingData: RiskRatingData): KnownBlock[] {
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

	const areas = Object.values(riskRatingData.assessment.areas);

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

	return blocks;
}

import { Button, KnownBlock, SectionBlock } from '@slack/web-api';
import { RiskArea } from '../../interfaces';
import { getRiskLevelEmojiByCriticality } from './data/emoji';

export function createRiskRatingBlock(areas: RiskArea[], switchAssessmentButtons: Button[]): KnownBlock[] {
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
			const rating = area.rating;
			const areaAssessment = area.config.ratings.filter((r) => r.criticality == rating)[0].areaAssessment;

			const ratingBlock: SectionBlock = {
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `${getRiskLevelEmojiByCriticality(rating)} *${area.config.name}:* ${areaAssessment}`,
				},
			};
			blocks.push(ratingBlock);
		});
	}

	blocks.push(
		{
			type: 'divider',
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: 'Want to see more assessment data?',
			},
		},
		{
			type: 'actions',
			elements: switchAssessmentButtons,
		}
	);

	return blocks;
}

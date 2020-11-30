import { KnownBlock } from '@slack/web-api';
import { ICompany } from '../../interfaces';

export function createAssessmentDataBlock(company: ICompany, message: string, url: string): Array<KnownBlock> {
	return [
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: `Assessment data for ${company}`,
			},
		},
		{
			type: 'divider',
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: message,
			},
		},
		{
			type: 'image',
			image_url: url,
			alt_text: 'Failed to load chart. Please try again later.',
		},
	];
}

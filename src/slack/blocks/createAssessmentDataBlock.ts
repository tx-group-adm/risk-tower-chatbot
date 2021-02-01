import { Button, KnownBlock } from '@slack/web-api';
import { ICompany, IType } from '../../interfaces';

export function createAssessmentDataBlock(
	type: IType,
	company: ICompany,
	message: string,
	url: string,
	parentName: string | null,
	switchAssessmentButtons: Button[]
): Array<KnownBlock> {
	const drillUpButton: Button[] = [
		{
			type: 'button',
			text: {
				type: 'plain_text',
				text: '← Back',
			},
			value: `Show me ${type} risks for ${parentName}`,
			style: 'danger',
		},
	];

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
			alt_text: 'assessment data chart',
		},
		{
			type: 'actions',
			elements: drillUpButton,
		},
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
		},
	];
}

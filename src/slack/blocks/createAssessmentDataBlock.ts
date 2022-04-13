import { Button, KnownBlock } from '@slack/web-api';
import { IType } from '../../interfaces';

export function createAssessmentDataBlock(
	type: IType,
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
			action_id: 'quickreply_0',
		},
	];

	return [
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

import { Button } from '@slack/web-api';
import { ICompany, IType, IAssessmentCategory } from '../../interfaces';

export function createSwitchAsessmentButtons(
	type: IType,
	company: ICompany,
	assessmentCategory: IAssessmentCategory
): Button[] {
	const ids = {
		'entity info': 0,
		'risk chart': 1,
		'risk ratings': 2,
		'risk epics': 3,
	};
	const buttons: Button[] = [
		{
			type: 'button',
			text: {
				type: 'plain_text',
				text: 'entity info',
			},
			value: `Show me ${type} entity info for ${company}`,
			action_id: 'quickreply_1',
		},
		{
			type: 'button',
			text: {
				type: 'plain_text',
				text: 'risk chart',
			},
			value: `Show me the ${type} risk chart for ${company}`,
			action_id: 'quickreply_2',
		},
		{
			type: 'button',
			text: {
				type: 'plain_text',
				text: 'risk ratings',
			},
			value: `Show me ${type} risk ratings for ${company}`,
			action_id: 'quickreply_3',
		},
		{
			type: 'button',
			text: {
				type: 'plain_text',
				text: 'risk epics',
			},
			value: `Show me ${type} risk epics for ${company}`,
			action_id: 'quickreply_4',
		},
	];

	buttons.splice(ids[assessmentCategory], 1);

	return buttons;
}

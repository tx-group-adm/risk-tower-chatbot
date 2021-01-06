import { KnownBlock } from '@slack/web-api';

function getEntityWeight(weight: number): string {
	if (weight <= 0.5) {
		return 'low';
	} else if (weight <= 1) {
		return 'medium';
	} else {
		return 'high';
	}
}

export function createEntityInfoBlock(info: {
	entityName: string;
	assessmentDate: string;
	assessorName: string;
	entityWeight: number;
}): KnownBlock[] {
	return [
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: 'Entity info',
			},
		},
		{
			type: 'divider',
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `*Entity name:* ${info.entityName}\n*Assessment date:*  ${info.assessmentDate}\n*Assessor name:*  ${
					info.assessorName
				}\n*Entity weight:*  ${getEntityWeight(info.entityWeight)}`,
			},
		},
	];
}

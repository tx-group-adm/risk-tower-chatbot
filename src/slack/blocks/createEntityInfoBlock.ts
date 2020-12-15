import { KnownBlock } from '@slack/web-api';

export function createEntityInfoBlock(info: {
	entityName: string;
	assessmentDate: string;
	assessorName: string;
	entityWeight: string;
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
				text: `*Entity name:* ${info.entityName}\n*Assessment date:*  ${info.assessmentDate}\n*Assessor name:*  ${info.assessorName}\n*Entity weight:*  ${info.entityWeight}`,
			},
		},
	];
}

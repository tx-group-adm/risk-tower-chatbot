import { Button, KnownBlock } from '@slack/web-api';
import { IJiraTicket } from '../../interfaces';

export function createJiraTicketsBlock(tickets: IJiraTicket[], switchAssessmentButtons: Button[]): KnownBlock[] {
	const blocks: KnownBlock[] = [
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: 'Jira Tickets',
			},
		},
		{
			type: 'divider',
		},
	];

	tickets.forEach((ticket) => {
		blocks.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `*${ticket.area}:*    <${ticket.epicLink}|${ticket.name}> *Status:* ${ticket.status}`,
			},
		});
		blocks.push({
			type: 'divider',
		});
	});

	blocks.push(
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

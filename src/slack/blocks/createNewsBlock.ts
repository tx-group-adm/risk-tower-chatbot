import { KnownBlock } from '@slack/web-api';
import { DateFilter, Highlight, ICompany, Incident } from '../../interfaces';
import { normalizeDateString, timeText } from '../../utils/date';

export function createNewsBlock(
	news: (Incident | Highlight)[],
	company: ICompany,
	dateFilter: DateFilter
): KnownBlock[] {
	if (news.length == 0) {
		return [
			{
				type: 'section',
				text: {
					type: 'plain_text',
					text: `There are no news for ${company} for the selected timespan.`,
				},
			},
		];
	}
	const incidents = news.filter((item) => item.type === 'incident');
	const highlights = news.filter((item) => item.type === 'highlight');

	const highlightDates = highlights.map((highlight) => normalizeDateString(highlight.date));
	const highlightMessages = highlights.map((highlight) => highlight.text);
	const highlightFields: string[] = [];

	const incidentDates = incidents.map((incident) => normalizeDateString(incident.date));
	const incidentMessages = incidents.map((incident) => incident.text);
	const incidentFields: string[] = [];

	for (let i = 0; i < incidents.length; i++) {
		incidentFields.push(incidentDates[i]);
		incidentFields.push(incidentMessages[i]);
	}

	for (let i = 0; i < highlights.length; i++) {
		highlightFields.push(highlightDates[i]);
		highlightFields.push(highlightMessages[i]);
	}

	return [
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: `News of ${company} from ${timeText[dateFilter]}`,
				emoji: true,
			},
		},
		{
			type: 'divider',
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: 'Incidents',
			},
		},
		...(incidentFields.length > 0
			? ([
					{
						type: 'section',
						fields: incidentFields.map((field) => ({
							type: 'plain_text',
							text: field,
							emoji: true,
						})),
					},
			  ] as KnownBlock[])
			: ([
					{
						type: 'section',
						text: {
							type: 'plain_text',
							text: `There are no incidents of ${company} for ${timeText[dateFilter]}`,
						},
					},
			  ] as KnownBlock[])),
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: 'Highlights',
			},
		},
		...(highlightFields.length > 0
			? ([
					{
						type: 'section',
						fields: highlightFields.map((field) => ({
							type: 'plain_text',
							text: field,
							emoji: true,
						})),
					},
			  ] as KnownBlock[])
			: ([
					{
						type: 'section',
						text: {
							type: 'plain_text',
							text: `There are no highlights of ${company} for ${timeText[dateFilter]}`,
						},
					},
			  ] as KnownBlock[])),
	];
}

import { KnownBlock } from '@slack/web-api';
import { DateFilter, ICompany, Incident } from '../../interfaces';
import { normalizeDateString, timeText } from '../../utils/date';

export function createIncidentsBlock(incidents: Incident[], company: ICompany, dateFilter: DateFilter): KnownBlock[] {
	if (incidents.length == 0) {
		return [
			{
				type: 'section',
				text: {
					type: 'plain_text',
					text: `There are no incidents for ${company} for the selected timespan.`,
				},
			},
		];
	}
	const incidentDates = incidents.map((incident) => normalizeDateString(incident.date));
	const incidentMessages = incidents.map((incident) => incident.text);
	const fields: string[] = [];

	for (let i = 0; i < incidents.length; i++) {
		fields.push(incidentDates[i]);
		fields.push(incidentMessages[i]);
	}

	return [
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: `Incidents of ${company} from ${timeText[dateFilter]}`,
				emoji: true,
			},
		},
		{
			type: 'divider',
		},
		{
			type: 'section',
			fields: fields.map((field) => ({
				type: 'plain_text',
				text: field,
				emoji: true,
			})),
		},
	];
}

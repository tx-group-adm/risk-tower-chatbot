import { KnownBlock } from '@slack/web-api';
import { DateFilter, Highlight, ICompany } from '../../interfaces';
import { normalizeDateString, timeText } from '../../utils/date';

export function createHighlightsBlock(
	highlights: Highlight[],
	company: ICompany,
	dateFilter: DateFilter
): KnownBlock[] {
	const highlightDates = highlights.map((highlight) => normalizeDateString(highlight.date));
	const highlightMessages = highlights.map((highlight) => highlight.text);
	const fields: string[] = [];

	for (let i = 0; i < highlights.length; i++) {
		fields.push(highlightDates[i]);
		fields.push(highlightMessages[i]);
	}

	return [
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: `Highlights of ${company} from ${timeText[dateFilter]}`,
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

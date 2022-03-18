import { DateFilter, DateTime } from '../interfaces';

export const timeText: { [index in DateFilter]: string } = {
	currentMonth: 'this month',
	previousMonth: 'last month',
	currentYear: 'this year',
	previousYear: 'last year',
};

export function normalizeDateString(dateString: string): string {
	const date = new Date(dateString);
	let day = date.getDate().toString();
	if (day.length < 2) {
		day = '0' + day;
	}
	let month = (date.getMonth() + 1).toString();
	if (month.length < 2) {
		month = '0' + month;
	}
	const year = date.getFullYear().toString();

	return `${day}.${month}.${year}`;
}

export function dateTimeToDateFilter(date_time: DateTime): DateFilter {
	// yep this is ugly
	const { startDate, endDate } = date_time;
	const [startYear, startMonth] = startDate.split('T')[0].split('-').map(parseInt);
	const [, endMonth] = endDate.split('T')[0].split('-').map(parseInt);
	const [currentYear, currentMonth] = new Date().toISOString().split('T')[0].split('-').map(parseInt);

	if (startMonth == endMonth) {
		// same month -> current month OR previous month
		if (startMonth == currentMonth) {
			return 'currentMonth';
		}
		return 'previousMonth';
	} else {
		if (startYear == currentYear) {
			return 'currentYear';
		} else {
			return 'previousYear';
		}
	}
}

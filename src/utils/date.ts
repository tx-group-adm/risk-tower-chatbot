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
	const startDate = new Date(date_time.startDate);
	const endDate = new Date(date_time.endDate);
	const currentDate = new Date();

	// check if startDate and endDate have the same month -> either current month or last month
	if (startDate.getMonth() == endDate.getMonth()) {
		// check if startDate and currentDate have the same month -> if yes, it is current month, else it is last month
		if (startDate.getMonth() == currentDate.getMonth()) {
			return 'currentMonth';
		}
		return 'previousMonth';
	}

	// check if startDate and endDate have the same year -> either current year or last year
	if (startDate.getFullYear() == endDate.getFullYear()) {
		// check if startDate and current Date have the same year -> if yes, it is current year, else it is last year
		if (startDate.getFullYear() == currentDate.getFullYear()) {
			return 'currentYear';
		}
		return 'previousYear';
	}

	throw new Error(`Invalid date time: ${date_time}`);
}

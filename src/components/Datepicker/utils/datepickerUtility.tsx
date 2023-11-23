interface CalendarDate {
	currentMonth: boolean;
	date: Date;
	today?: boolean;
}

const isToday = (date: Date): boolean => {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
};

export const generateDate = (
	month: number = new Date().getMonth(),
	year: number = new Date().getFullYear()
): CalendarDate[] => {
	const firstDateOfMonth = new Date(year, month, 1);
	const lastDateOfPreviousMonth = new Date(year, month, 0);
	const lastDateOfMonth = new Date(year, month + 1, 0);

	const arrayOfDate: CalendarDate[] = [];

	for (let i = firstDateOfMonth.getDay(); i > 0; i--) {
		const date = new Date(lastDateOfPreviousMonth.getFullYear(), lastDateOfPreviousMonth.getMonth(), lastDateOfPreviousMonth.getDate() - (i - 1));
		arrayOfDate.push({
			currentMonth: false,
			date,
			
		});
	}

	for (let i = 1; i <= lastDateOfMonth.getDate(); i++) {
		const date = new Date(year, month, i);
		arrayOfDate.push({
			currentMonth: true,
			date,
			today: isToday(date),
		});
	}

	const remaining = 42 - arrayOfDate.length;
	for (let i = 1; i <= remaining; i++) {
		const date = new Date(year, month + 1, i);
		arrayOfDate.push({
			currentMonth: false,
			date,
		});
	}
	return arrayOfDate;
};

export const months: string[] = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
interface CalendarDate {
	currentMonth: boolean;
	date?: Date;
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

export const generateDateExpanded = (
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

	const remaining = 49 - arrayOfDate.length;
	for (let i = 1; i <= remaining; i++) {
		const date = new Date(year, month + 1, i);
		arrayOfDate.push({
			currentMonth: false,
			date,
		});
	}
	return arrayOfDate;
};

export const getFirstDayOfMonth = (date: Date): Date => {
	return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getFirstDayOfNextMonth = (date: Date): Date => {
	const nextMonth = date.getMonth() + 1;
	const nextYear = date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear();
	return new Date(nextYear, nextMonth, 1);
};

export const generateDaysArray = (date: Date): Date[] => {
	const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	const firstDayOfMonth = getFirstDayOfMonth(date);
	const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

	const daysArray = [];
	const prevMonthDays = [];
	// Add days from the previous month to the beginning of the array
	for (let i = firstDayOfMonth.getDay(); i > 0; i--) {
		const prevMonthDay = new Date(firstDayOfMonth);
		prevMonthDay.setDate(prevMonthDay.getDate() - i);
		prevMonthDays.push(prevMonthDay);
	}
	for (let i = prevMonthDays.length - 1; i >= 0; i--) {
		daysArray.unshift(prevMonthDays[i]);
	}
	// Add days of the current month
	for (let day = 1; day <= daysInMonth; day++) {
		daysArray.push(new Date(date.getFullYear(), date.getMonth(), day));
	}

	// Add days from the next month to the end of the array
	for (let i = 1; daysArray.length < 42; i++) {
		const nextMonthDay = new Date(lastDayOfMonth);
		nextMonthDay.setDate(nextMonthDay.getDate() + i);
		daysArray.push(nextMonthDay);
	}

	return daysArray;
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

export const days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
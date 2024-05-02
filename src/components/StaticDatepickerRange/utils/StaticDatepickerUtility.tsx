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

export const visibleOption = ["Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year", "Custom"]
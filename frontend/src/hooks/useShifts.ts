import shifts from '../data/shifts';

export interface Shift {
	startedAt: string;
	endedAt: string;
	status: 'DECLINED' | 'CONFIRMED' | 'PENDING';
	userId: number;
	chiName: string;
	lastName: string;
	firstName: string;
	role: 'EN' | 'ST' | 'PWH';
}

export type GroupedShifts = Record<string, Record<string, Shift[]>>;

const groupShifts = (shifts: Shift[]) => {
	const groupByMonthAndDay = shifts.reduce((acc, shift) => {
		const startedAtDate = new Date(shift.startedAt);

		// format month-year key (e.g. "November 2023")
		const monthYearKey = startedAtDate.toLocaleString('en-US', {
			month: 'long',
			year: 'numeric',
		});

		// format day-key (e.g. "25" for 25th day of the month)
		const dayKey = startedAtDate.toLocaleString('en-US', {
			day: '2-digit',
		});

		// initialize month object if it doesn't exist
		if (!acc[monthYearKey]) {
			acc[monthYearKey] = {};
		}

		// initialize day array if it doesn't exist
		if (!acc[monthYearKey][dayKey]) {
			acc[monthYearKey][dayKey] = [];
		}

		// push the shift to the correct day array
		acc[monthYearKey][dayKey].push(shift);

		return acc;
	}, {} as GroupedShifts);

	return groupByMonthAndDay;
};

const useShifts = () => {
	const groupedShifts = groupShifts(shifts as Shift[]);
	return {
		data: groupedShifts,
		isLoading: false,
		error: null,
	};
};

export default useShifts;

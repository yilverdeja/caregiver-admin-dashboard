import { create } from 'zustand';
import shifts from './data/shifts';

export interface Shift {
	id: number; // id property to define a shift
	startedAt: string;
	endedAt: string;
	status: 'DECLINED' | 'CONFIRMED' | 'PENDING';
	userId: number;
	chiName: string;
	lastName: string;
	firstName: string;
	role: 'EN' | 'ST' | 'PWH';
}

type NoIdShifts = Omit<Shift, 'id'>[];
type ShiftIdMap = Record<number, { monthKey: string; dayKey: string }>;
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

const assignIdsToShifts = (shifts: NoIdShifts): Shift[] => {
	return shifts.map((shift, index) => ({ ...shift, id: index }));
};

const createShiftIdMap = (shifts: GroupedShifts) => {
	const shiftIdToMonthDayMap: ShiftIdMap = {};

	for (const monthKey in shifts) {
		for (const dayKey in shifts[monthKey]) {
			const xx = shifts[monthKey][dayKey];
			for (const x of xx) {
				shiftIdToMonthDayMap[x.id] = { monthKey, dayKey };
			}
		}
	}

	return shiftIdToMonthDayMap;
};

interface ShiftStore {
	shiftsByMonthAndDay: GroupedShifts;
	shiftIdToMonthDayMap: ShiftIdMap;
	isLoading: boolean;
	error: string | null;
	setShifts: () => void;
}

export const useShiftStore = create<ShiftStore>((set) => ({
	shiftsByMonthAndDay: {},
	shiftIdToMonthDayMap: {},
	isLoading: false,
	error: null,
	setShifts: () => {
		const groupedShifts = groupShifts(
			assignIdsToShifts(shifts as NoIdShifts) as Shift[]
		);
		set({
			shiftsByMonthAndDay: groupedShifts,
		});
		set({
			shiftIdToMonthDayMap: createShiftIdMap(groupedShifts),
		});
	},
}));

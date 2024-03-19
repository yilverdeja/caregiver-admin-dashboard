import { create } from 'zustand';
// TODO: use immer to update states
// import { immer } from 'zustand/middleware/immer'
import shifts from './data/shifts';
import APIClient from './services/api-client';
const apiClient = new APIClient('/shifts');

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
	const groupByMonthAndDay = shifts
		.sort(
			(a, b) =>
				new Date(a.startedAt).getTime() -
				new Date(b.startedAt).getTime()
		)
		.reduce((acc, shift) => {
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
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	filteredShiftsByMonthAndDay: GroupedShifts;
	setShifts: () => void;
	updateShiftStatus: (
		shiftId: number,
		status: 'DECLINED' | 'CONFIRMED' | 'PENDING'
	) => void;
	loadShifts: () => Promise<void>;
}

export const useShiftStore = create<ShiftStore>((set, get) => ({
	shiftsByMonthAndDay: {},
	shiftIdToMonthDayMap: {},
	filteredShiftsByMonthAndDay: {},
	isLoading: false,
	error: null,
	loadShifts: async () => {
		// TODO: load shifts and handle
		apiClient.getAll({});
	},
	setShifts: () => {
		const groupedShifts = groupShifts(
			assignIdsToShifts(shifts as NoIdShifts) as Shift[]
		);
		set({
			shiftsByMonthAndDay: groupedShifts,
			filteredShiftsByMonthAndDay: groupedShifts,
			shiftIdToMonthDayMap: createShiftIdMap(groupedShifts),
		});
	},
	searchTerm: '',
	setSearchTerm: (term) => {
		set({ searchTerm: term });
		const filtered = filterGroupedShifts(term, get().shiftsByMonthAndDay);
		set({ filteredShiftsByMonthAndDay: filtered });
	},
	updateShiftStatus: (shiftId, newStatus) => {
		set((state) => {
			const idMap = state.shiftIdToMonthDayMap;
			if (!(shiftId in idMap)) {
				// return the current state if shiftId is not found
				return { ...state };
			}

			const { monthKey, dayKey } = idMap[shiftId];

			// update the status in the groupedShifts
			const updatedGroupedShifts = {
				...state.shiftsByMonthAndDay,
				[monthKey]: {
					...state.shiftsByMonthAndDay[monthKey],
					[dayKey]: state.shiftsByMonthAndDay[monthKey][dayKey].map(
						(shift) =>
							shift.id === shiftId && shift.status === 'PENDING'
								? { ...shift, status: newStatus }
								: shift
					),
				},
			};

			// update the filtered GroupedShifts if they exist
			const updatedFilteredGroupedShifts =
				state.filteredShiftsByMonthAndDay && {
					...state.filteredShiftsByMonthAndDay,
					[monthKey]: {
						...state.filteredShiftsByMonthAndDay[monthKey],
						[dayKey]: state.filteredShiftsByMonthAndDay[monthKey][
							dayKey
						].map((shift) =>
							shift.id === shiftId && shift.status === 'PENDING'
								? { ...shift, status: newStatus }
								: shift
						),
					},
				};

			return {
				shiftsByMonthAndDay: updatedGroupedShifts,
				filteredShiftsByMonthAndDay:
					updatedFilteredGroupedShifts ||
					state.filteredShiftsByMonthAndDay,
			};
		});
	},
}));

const filterGroupedShifts = (
	searchTerm: string,
	groupedShifts: GroupedShifts
): GroupedShifts => {
	const filtered: GroupedShifts = {};
	for (const monthKey in groupedShifts) {
		filtered[monthKey] = {};
		for (const dayKey in groupedShifts[monthKey]) {
			const shifts = groupedShifts[monthKey][dayKey];
			filtered[monthKey][dayKey] = shifts.filter((shift) => {
				const shiftName =
					shift.lastName +
					' ' +
					shift.firstName +
					' ' +
					shift.chiName;
				return shiftName
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
			});
		}
	}
	return filtered;
};

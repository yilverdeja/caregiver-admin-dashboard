import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import APIClient from './services/api-client';

const apiClient = new APIClient<Shift>('/shifts');

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

type ShiftIdMap = Record<number, { monthKey: string; dayKey: string }>;
export type GroupedShifts = Record<string, Record<string, Shift[]>>;

const groupShifts = (shifts: Shift[]) => {
	const groupByMonthAndDay = shifts.reduce((acc, shift) => {
		const startedAtDate = new Date(shift.startedAt);

		// format month-year key (e.g. "November 2023")
		const monthYearKey = startedAtDate.toLocaleString('en-US', {
			timeZone: 'UTC',
			month: 'long',
			year: 'numeric',
		});

		// format day-key (e.g. "25" for 25th day of the month)
		const dayKey = startedAtDate.toLocaleString('en-US', {
			timeZone: 'UTC',
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

type State = {
	shiftsByMonthAndDay: GroupedShifts;
	filteredShiftsByMonthAndDay: GroupedShifts;
	shiftIdToMonthDayMap: ShiftIdMap;
	isLoading: boolean;
	error: string | null;
	searchTerm: string;
};

type Actions = {
	setSearchTerm: (term: string) => void;
	filteredShiftsByMonthAndDay: GroupedShifts;
	setShifts: (shifts: Shift[]) => void;
	updateShiftStatus: (
		shiftId: number,
		status: 'DECLINED' | 'CONFIRMED' | 'PENDING'
	) => Promise<void>;
	confirmSelectedShiftsStatus: (shiftIds: number[]) => Promise<void>;
};

export const useShiftStore = create<State & Actions>()(
	immer((set) => ({
		shiftsByMonthAndDay: {},
		shiftIdToMonthDayMap: {},
		filteredShiftsByMonthAndDay: {},
		isLoading: false,
		error: null,
		searchTerm: '',
		setShifts: (shifts) => {
			set((state) => {
				const groupedShifts = groupShifts(shifts);
				state.shiftsByMonthAndDay = groupedShifts;
				state.filteredShiftsByMonthAndDay = filterGroupedShifts(
					state.searchTerm,
					groupedShifts
				);
				state.shiftIdToMonthDayMap = createShiftIdMap(groupedShifts);
			});
		},
		setSearchTerm: (term) => {
			set((state) => {
				state.searchTerm = term;
				state.filteredShiftsByMonthAndDay = filterGroupedShifts(
					term,
					state.shiftsByMonthAndDay
				);
			});
		},
		updateShiftStatus: async (shiftId, newStatus) => {
			set((state) => {
				state.isLoading = true;
			});

			try {
				// update the shift status on the backend
				await apiClient.updateShiftStatus(shiftId, newStatus);

				// update the local state when the api call is successful
				set((state) => {
					const idMap = state.shiftIdToMonthDayMap;
					if (shiftId in idMap) {
						const { monthKey, dayKey } = idMap[shiftId];
						const shifts =
							state.shiftsByMonthAndDay[monthKey][dayKey];
						const filteredShifts =
							state.filteredShiftsByMonthAndDay[monthKey]?.[
								dayKey
							] || [];

						shifts.forEach((shift) => {
							if (
								shift.id === shiftId &&
								shift.status === 'PENDING'
							) {
								shift.status = newStatus;
							}
						});
						filteredShifts.forEach((shift) => {
							if (
								shift.id === shiftId &&
								shift.status === 'PENDING'
							) {
								shift.status = newStatus;
							}
						});
					}
				});
			} catch (error) {
				// handle any errors
				set((state) => {
					if (error instanceof Error) {
						state.error = error.message;
					} else {
						set((state) => {
							state.error = 'An unexpected error occurred';
						});
						console.error('Caught an unexpected error:', error);
					}
				});
			} finally {
				// set isLoading to false to indicate that loading has finished
				set((state) => {
					state.isLoading = false;
				});
			}
		},
		confirmSelectedShiftsStatus: async (shiftIds) => {
			set((state) => {
				state.isLoading = true;
			});

			try {
				// confirm the shifts on the backend
				const response = await apiClient.confirmShifts(shiftIds);

				// only update the shifts that were updated
				const updatedShiftIds = response.updatedShifts.map(
					(shift) => shift.id
				);

				set((state) => {
					const idMap = state.shiftIdToMonthDayMap;
					updatedShiftIds.forEach((shiftId) => {
						if (shiftId in idMap) {
							const { monthKey, dayKey } = idMap[shiftId];
							const shifts =
								state.shiftsByMonthAndDay[monthKey][dayKey];
							const filteredShifts =
								state.filteredShiftsByMonthAndDay[monthKey]?.[
									dayKey
								] || [];

							shifts.forEach((shift) => {
								if (
									shift.id === shiftId &&
									shift.status === 'PENDING'
								) {
									shift.status = 'CONFIRMED';
								}
							});

							filteredShifts.forEach((shift) => {
								if (
									shift.id === shiftId &&
									shift.status === 'PENDING'
								) {
									shift.status = 'CONFIRMED';
								}
							});
						}
					});
				});
			} catch (error) {
				// handle any errors
				set((state) => {
					if (error instanceof Error) {
						state.error = error.message;
					} else {
						set((state) => {
							state.error = 'An unexpected error occurred';
						});
						console.error('Caught an unexpected error:', error);
					}
				});
			} finally {
				// set isLoading to false to indicate that loading has finished
				set((state) => {
					state.isLoading = false;
				});
			}
		},
	}))
);

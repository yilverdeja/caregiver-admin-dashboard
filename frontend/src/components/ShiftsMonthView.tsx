import { useEffect, useMemo, useState } from 'react';
import { Shift, useShiftStore } from '../store';
import ShiftsDayView from './ShiftsDayView';
import ShiftSelectionContext from '../contexts/ShiftSelectionContext';
import StatusButton from './StatusButton';
import Checkbox from './Checkbox';

interface Props {
	monthKey: string;
}

export type SelectedShifts = Record<number, boolean>;

const ShiftsMonthView = ({ monthKey }: Props) => {
	const { filteredShiftsByMonthAndDay, confirmSelectedShiftsStatus } =
		useShiftStore();
	const [selectedShifts, setSelectedShifts] = useState<SelectedShifts>({});
	const [isAllChecked, setAllChecked] = useState(false);

	const shiftsInMonth = useMemo(() => {
		return Object.keys(filteredShiftsByMonthAndDay[monthKey]).reduce(
			(acc, dayKey) => {
				return [
					...acc,
					...filteredShiftsByMonthAndDay[monthKey][dayKey].map(
						(shift) => shift
					),
				];
			},
			[] as Shift[]
		);
	}, [monthKey, filteredShiftsByMonthAndDay]);

	useEffect(() => {
		const newSelectedShifts: SelectedShifts = {};
		for (const shift of shiftsInMonth) {
			newSelectedShifts[shift.id] =
				isAllChecked && shift.status === 'PENDING';
		}
		setSelectedShifts(newSelectedShifts);
	}, [isAllChecked, shiftsInMonth]);

	if (!filteredShiftsByMonthAndDay[monthKey] || shiftsInMonth.length === 0) {
		// no shifts in a given month
		return null;
	}

	const sortedDays = Object.keys(filteredShiftsByMonthAndDay[monthKey]).sort(
		(a, b) => parseInt(a) - parseInt(b)
	);

	// gets the number of selected shifts
	const selectedCount = Object.keys(selectedShifts).reduce(
		(count, k) => count + (selectedShifts[parseInt(k)] ? 1 : 0),
		0
	);

	const contextValue = {
		isAllChecked,
		selectedShifts,
		toggleShift: (shiftId: number) => {
			setSelectedShifts(() => ({
				...selectedShifts,
				[shiftId]: !selectedShifts[shiftId],
			}));
		},
		toggleAll: () => {
			setAllChecked(() => !isAllChecked);
		},
		setAllChecked,
	};

	return (
		<ShiftSelectionContext.Provider value={contextValue}>
			<div className="flex flex-col w-full h-full rounded-md overflow-hidden flex-none sm:w-1/2 lg:w-1/3">
				<header className="flex flex-row items-center gap-4 bg-gray-200 p-2 h-20">
					<div className="flex flex-column items-center">
						<Checkbox
							checked={isAllChecked}
							onToggle={() => setAllChecked(!isAllChecked)}
						/>
					</div>
					<div className="flex flex-row flex-wrap flex-grow gap-1 overflow-y-auto">
						<h2 className="font-bold">{monthKey}</h2>
						<p>
							({shiftsInMonth.length} held shift
							{shiftsInMonth.length === 1 ? '' : 's'})
						</p>
					</div>
					<StatusButton
						onClick={() => {
							confirmSelectedShiftsStatus(
								Object.keys(selectedShifts)
									.filter(
										(id) => selectedShifts[parseInt(id)]
									)
									.map((id) => parseInt(id))
							).then(() => setAllChecked(false));
						}}
						disabled={selectedCount === 0}
					/>
				</header>

				<div className="overflow-auto sm:overflow-y-auto sm:h-full sm:flex-grow">
					{sortedDays.map((dayKey) => (
						<ShiftsDayView
							key={dayKey}
							monthKey={monthKey}
							dayKey={dayKey}
						/>
					))}
				</div>
			</div>
		</ShiftSelectionContext.Provider>
	);
};

export default ShiftsMonthView;

import { useEffect, useMemo, useState } from 'react';
import { useShiftStore } from '../store';
import ShiftsDayView from './ShiftsDayView';
import ShiftSelectionContext from '../contexts/ShiftSelectionContext';

interface Props {
	monthKey: string;
}

export type SelectedShifts = Record<number, boolean>;

const ShiftsMonthView = ({ monthKey }: Props) => {
	const { shiftsByMonthAndDay } = useShiftStore();
	const [selectedShifts, setSelectedShifts] = useState<SelectedShifts>({});
	const [isAllChecked, setAllChecked] = useState(false);

	const shiftsInMonth = useMemo(() => {
		return Object.keys(shiftsByMonthAndDay[monthKey]).reduce(
			(acc, dayKey) => {
				return [
					...acc,
					...shiftsByMonthAndDay[monthKey][dayKey].map(
						(shift) => shift.id
					),
				];
			},
			[] as number[]
		);
	}, [monthKey, shiftsByMonthAndDay]);

	useEffect(() => {
		const newSelectedShifts: SelectedShifts = {};
		for (const id of shiftsInMonth) {
			newSelectedShifts[id] = isAllChecked;
		}
		setSelectedShifts(newSelectedShifts);
	}, [isAllChecked, shiftsInMonth]);

	if (!shiftsByMonthAndDay[monthKey]) {
		// no shifts in a given month
		return null;
	}

	const sortedDays = Object.keys(shiftsByMonthAndDay[monthKey]).sort(
		(a, b) => new Date(a).getTime() - new Date(b).getTime()
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
			<div className="w-full rounded-md overflow-hidden flex-none sm:w-2/3 md:w-1/3 mr-8 md:pb-4 border">
				<header className="flex flex-row gap-2 bg-gray-200 px-2 py-2">
					<input
						type="checkbox"
						defaultChecked={isAllChecked}
						onChange={(event) =>
							setAllChecked(event.target.checked)
						}
					/>
					<div className="flex flex-row flex-wrap flex-grow gap-y-1 gap-x-2 items-center">
						<h2>{monthKey}</h2>
						<p>
							({shiftsInMonth.length} held shift
							{shiftsInMonth.length === 1 ? '' : 's'})
						</p>
					</div>
					<button className="bg-green-600 text-white px-2 py-1 rounded-md">
						Confirm
					</button>
				</header>

				<div>
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

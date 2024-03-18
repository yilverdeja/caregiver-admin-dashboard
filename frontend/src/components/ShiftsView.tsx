import ShiftsMonthView from './ShiftsMonthView';
import { useShiftStore } from '../store';
import { useEffect } from 'react';

const ShiftsView = () => {
	const { shiftsByMonthAndDay, setShifts } = useShiftStore();
	useEffect(() => {
		setShifts();
	}, [setShifts]);

	const sortedMonths = Object.keys(shiftsByMonthAndDay).sort(
		(a, b) => new Date(a).getTime() - new Date(b).getTime()
	);
	return (
		<div className="flex flex-col sm:flex-row gap-4 overflow-y-auto h-full">
			{sortedMonths.map((monthKey) => (
				<ShiftsMonthView key={monthKey} monthKey={monthKey} />
			))}
		</div>
	);
};

export default ShiftsView;

import ShiftsMonthView from './ShiftsMonthView';
import { useShiftStore } from '../store';
import { useEffect } from 'react';
import useShifts from '../hooks/useShifts';

const ShiftsView = () => {
	const { data: shifts, isLoading, isError } = useShifts();
	const { setShifts, shiftsByMonthAndDay } = useShiftStore();

	useEffect(() => {
		if (shifts) {
			setShifts(shifts);
		}
	}, [shifts, setShifts]);

	if (isLoading) return 'Loading...';
	if (isError) return 'Error retrieving shifts...';

	const sortedMonths = Object.keys(shiftsByMonthAndDay);

	return (
		<div className="flex flex-col sm:flex-row gap-4 overflow-y-auto h-full">
			{sortedMonths.map((monthKey) => (
				<ShiftsMonthView key={monthKey} monthKey={monthKey} />
			))}
		</div>
	);
};

export default ShiftsView;

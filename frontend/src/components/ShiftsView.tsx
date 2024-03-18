import ShiftsMonthView from './ShiftsMonthView';
import { useShiftStore } from '../store';
import { useEffect } from 'react';

interface Props {
	searchText: string;
}

const ShiftsView = ({ searchText }: Props) => {
	// const { data, isLoading, error } = useShifts();
	const { shiftsByMonthAndDay, setShifts } = useShiftStore();
	useEffect(() => {
		setShifts();
	}, [setShifts]);

	return (
		<div className="flex flex-col sm:flex-row gap-4 flex-no-wrap overflow-y-scroll overflow-x-clip sm:overflow-y-clip sm:overflow-x-scroll items-start h-full my-4">
			{Object.keys(shiftsByMonthAndDay).map((monthKey) => (
				<ShiftsMonthView key={monthKey} monthKey={monthKey} />
			))}
		</div>
	);
};

export default ShiftsView;

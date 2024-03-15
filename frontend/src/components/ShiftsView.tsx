import { useEffect, useState } from 'react';
import useShifts, { Shift } from '../hooks/useShifts';
import ShiftsMonthView from './ShiftsMonthView';

interface Props {
	// shifts: Shift[];
	searchText: string;
}

const ShiftsView = ({ searchText }: Props) => {
	const { data, isLoading, error } = useShifts();
	const [shifts, setShifts] = useState<Shift[]>(data);
	const [shiftsByMonth, setShiftsByMonth] = useState({});

	useEffect(() => {
		setShifts(
			data.filter((shift) => {
				const name = shift.lastName + shift.firstName + shift.chiName;
				return searchText === ''
					? shift
					: name.toLowerCase().includes(searchText.toLowerCase());
			})
		);
	}, [searchText, data]);

	// groups by month-year
	useEffect(() => {
		setShiftsByMonth(
			shifts.reduce((accum, shift) => {
				const dt = new Date(shift.startedAt);
				// const dt_key: string = `${dt.getMonth()}-${dt.getFullYear()}`;
				const dt_key: string = dt.toLocaleString('en-US', {
					month: 'long',
					year: 'numeric',
				});
				if (dt_key in accum) {
					accum[dt_key].push(shift);
				} else {
					accum[dt_key] = [shift];
				}
				return accum;
			}, {})
		);
	}, [shifts]);

	return (
		<div className="flex flex-col sm:flex-row gap-4 flex-no-wrap overflow-y-scroll overflow-x-clip sm:overflow-y-clip sm:overflow-x-scroll items-start h-full my-4">
			{Object.entries(shiftsByMonth).map(([key, value]) => (
				<ShiftsMonthView key={key} title={key} shifts={value} />
			))}
			{/* <ShiftsMonthView />
			<ShiftsMonthView />
			<ShiftsMonthView /> */}
			{/* <div className="h-40 w-full bg-yellow-300 flex-none sm:w-2/3 md:w-1/3 mr-8 md:pb-4 border rounded-lg"></div>
			<div className="h-40 w-full bg-yellow-300 flex-none sm:w-2/3 md:w-1/3 mr-8 md:pb-4 border rounded-lg"></div>
			<div className="h-40 w-full bg-yellow-300 flex-none sm:w-2/3 md:w-1/3 mr-8 md:pb-4 border rounded-lg"></div>
			<div className="h-40 w-full bg-yellow-300 flex-none sm:w-2/3 md:w-1/3 mr-8 md:pb-4 border rounded-lg"></div>
			<div className="h-40 w-full bg-yellow-300 flex-none sm:w-2/3 md:w-1/3 mr-8 md:pb-4 border rounded-lg"></div>
			<div className="h-40 w-full bg-yellow-300 flex-none sm:w-2/3 md:w-1/3 mr-8 md:pb-4 border rounded-lg"></div>
			<div className="h-40 w-full bg-yellow-300 flex-none sm:w-2/3 md:w-1/3 mr-8 md:pb-4 border rounded-lg"></div> */}
		</div>
	);
};

export default ShiftsView;

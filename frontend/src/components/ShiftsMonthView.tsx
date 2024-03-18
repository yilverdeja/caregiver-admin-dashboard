import { useShiftStore } from '../store';
import ShiftsDayView from './ShiftsDayView';

interface Props {
	monthKey: string;
}

const ShiftsMonthView = ({ monthKey }: Props) => {
	const { shiftsByMonthAndDay } = useShiftStore();

	if (!shiftsByMonthAndDay[monthKey]) {
		// no shifts in a given month
		return null;
	}
	const shiftsInMonth = Object.keys(shiftsByMonthAndDay[monthKey]).reduce(
		(acc, shifts) => {
			return acc + shifts.length;
		},
		0
	);

	return (
		<div className="w-full rounded-md overflow-hidden flex-none sm:w-2/3 md:w-1/3 mr-8 md:pb-4 border">
			<header className="flex flex-row gap-2 bg-gray-200 px-2 py-2">
				<input type="checkbox" />
				<div className="flex flex-row flex-wrap flex-grow gap-y-1 gap-x-2 items-center">
					<h2>{monthKey}</h2>
					<p>
						({shiftsInMonth} held shift
						{shiftsInMonth === 1 ? '' : 's'})
					</p>
				</div>
				<button className="bg-green-600 text-white px-2 py-1 rounded-md">
					Confirm
				</button>
			</header>

			<div>
				{Object.keys(shiftsByMonthAndDay[monthKey]).map((dayKey) => (
					<ShiftsDayView
						key={dayKey}
						monthKey={monthKey}
						dayKey={dayKey}
					/>
				))}
			</div>
		</div>
	);
};

export default ShiftsMonthView;

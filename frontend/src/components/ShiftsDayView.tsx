import { useShiftStore } from '../store';
import ShiftCard from './ShiftCard';
import ShiftDate from './ShiftDate';

interface Props {
	monthKey: string;
	dayKey: string;
}

function ShiftsDayView({ monthKey, dayKey }: Props) {
	const { shiftsByMonthAndDay } = useShiftStore();
	const shifts = shiftsByMonthAndDay[monthKey][dayKey];

	if (!shifts || shifts.length === 0) {
		// Handle scenario where there are no shifts for the given day
		return null;
	}

	return (
		<div>
			<ShiftDate name={dayKey + ' ' + monthKey} />
			{shifts.map((shift) => (
				<ShiftCard key={shift.id} shift={shift} />
			))}
		</div>
	);
}

export default ShiftsDayView;

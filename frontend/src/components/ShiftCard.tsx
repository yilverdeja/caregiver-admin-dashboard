import { useContext } from 'react';
import { Shift } from '../store';
import ShiftSelectionContext from '../contexts/ShiftSelectionContext';

interface Props {
	shift: Shift;
}

const ShiftCard = ({ shift }: Props) => {
	const { selectedShifts, toggleShift } = useContext(ShiftSelectionContext);
	const isChecked = selectedShifts[shift.id] || false;

	return (
		<div className="flex flex-row items-center px-2">
			<input
				type="checkbox"
				className="mx-4"
				checked={isChecked}
				// onChange={(event) => setSelected(event.target.checked)}
				onChange={() => toggleShift(shift.id)}
			/>
			<div className="flex-grow flex flex-col my-2">
				<p className="my-1">
					{new Date(shift.startedAt).toLocaleString('en-US', {
						timeStyle: 'short',
					})}
					-
					{new Date(shift.endedAt).toLocaleString('en-US', {
						timeStyle: 'short',
					})}
				</p>
				<p className="my-1">
					{shift.userId} - {shift.lastName} {shift.firstName}{' '}
					{shift.chiName}
				</p>
				<div className="flex flex-row gap-1 items-center my-1">
					<span className="flex w-3 h-3 me-3 bg-indigo-500 rounded-full"></span>
					<p>{shift.role}</p>
				</div>
				<div className="flex flex-row gap-2 my-1">
					<button className="bg-red-600 text-white px-2 py-1 rounded-md">
						Decline
					</button>
					<button className="bg-green-600 text-white px-2 py-1 rounded-md">
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};

export default ShiftCard;

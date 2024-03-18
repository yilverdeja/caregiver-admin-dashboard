import { useContext } from 'react';
import { Shift } from '../store';
import ShiftSelectionContext from '../contexts/ShiftSelectionContext';
import StatusButton from './StatusButton';
import ShiftRole from './ShiftRole';

interface Props {
	shift: Shift;
	onUpdateStatus: (status: 'DECLINED' | 'CONFIRMED' | 'PENDING') => void;
}

const ShiftCard = ({ shift, onUpdateStatus }: Props) => {
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
				<ShiftRole role={shift.role} />
				<div className="flex flex-row gap-2 my-1">
					<StatusButton
						onClick={() => onUpdateStatus('DECLINED')}
						disabled={shift.status === 'DECLINED'}
						show={shift.status === 'PENDING'}
						buttonType="DECLINE"
					>
						{shift.status === 'PENDING' ? 'Decline' : 'Declined'}
					</StatusButton>
					<StatusButton
						onClick={() => onUpdateStatus('CONFIRMED')}
						disabled={shift.status === 'CONFIRMED'}
						show={shift.status === 'PENDING'}
						buttonType="CONFIRM"
					>
						{shift.status === 'PENDING' ? 'Confirm' : 'Confirmed'}
					</StatusButton>
				</div>
			</div>
		</div>
	);
};

export default ShiftCard;

import { useContext } from 'react';
import { Shift } from '../store';
import ShiftSelectionContext from '../contexts/ShiftSelectionContext';
import StatusButton from './StatusButton';
import ShiftRole from './ShiftRole';
import Checkbox from './Checkbox';
import ShiftTime from './ShiftTime';

interface Props {
	shift: Shift;
	onUpdateStatus: (status: 'DECLINED' | 'CONFIRMED' | 'PENDING') => void;
}

const ShiftCard = ({ shift, onUpdateStatus }: Props) => {
	const { selectedShifts, toggleShift } = useContext(ShiftSelectionContext);
	const isChecked = selectedShifts[shift.id] || false;

	return (
		<div className="flex flex-row items-center px-2">
			<div className="mx-4">
				<Checkbox
					checked={isChecked}
					onToggle={() => toggleShift(shift.id)}
				/>
			</div>
			<div className="flex-grow flex flex-col my-2">
				<ShiftTime
					start={shift.startedAt}
					end={shift.endedAt}
					roundTo5Mins={true}
				/>
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

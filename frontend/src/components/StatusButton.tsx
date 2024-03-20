import { Shift } from '../store';

type ButtonType = 'CONFIRM' | 'DECLINE' | 'ALL';
type StatusType = Shift['status'];

interface Props {
	onClick: () => void;
	disabled?: boolean;
	buttonType?: ButtonType;
	status?: StatusType;
}

const baseStyle = 'px-2 py-1 rounded-md';
const buttonStyles: Record<ButtonType, string> = {
	ALL: `${baseStyle} bg-emerald-500 text-white border border-emerald-500 hover:bg-emerald-600 hover:border-emerald-600`,
	CONFIRM: `${baseStyle} bg-emerald-500 text-white border border-emerald-500 hover:bg-emerald-600 hover:border-emerald-600`,
	DECLINE: `${baseStyle} bg-transparent text-red-400 border border-red-400 font-medium`,
};

const disabledButtonStyles: Record<ButtonType, string> = {
	ALL: `${baseStyle} bg-gray-400 text-white border border-gray-400`,
	CONFIRM: `${baseStyle} bg-emerald-100 text-emerald-500 border border-emerald-100 font-medium`,
	DECLINE: `${baseStyle} bg-red-100 text-red-500 border border-red-100 font-medium`,
};

const getButtonStyle = (buttonType: ButtonType, disabled: boolean) => {
	if (disabled) {
		return disabledButtonStyles[buttonType];
	}
	return buttonStyles[buttonType] || buttonStyles['ALL'];
};

const getButtonText = (buttonType: ButtonType, disabled: boolean) => {
	if (buttonType === 'CONFIRM') return disabled ? 'Confirmed' : 'Confirm';
	if (buttonType === 'DECLINE') return disabled ? 'Declined' : 'Decline';
	return 'Confirm';
};

const isButtonHidden = (buttonType: ButtonType, status?: StatusType) => {
	return (
		(status === 'CONFIRMED' && buttonType === 'DECLINE') ||
		(status === 'DECLINED' && buttonType === 'CONFIRM')
	);
};

const StatusButton = ({
	onClick,
	disabled = false,
	buttonType = 'ALL',
	status,
}: Props) => {
	if (isButtonHidden(buttonType, status)) return null;

	const buttonText = getButtonText(buttonType, disabled);
	const buttonStyle = getButtonStyle(buttonType, disabled);

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={buttonStyle}
		>
			{buttonText}
		</button>
	);
};

export default StatusButton;

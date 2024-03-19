interface Props {
	onClick: () => void;
	disabled?: boolean;
	buttonType?: 'CONFIRM' | 'DECLINE' | 'ALL';
	status?: 'CONFIRMED' | 'PENDING' | 'DECLINED' | null;
}

const StatusButton = ({
	onClick,
	disabled = false,
	buttonType = 'ALL',
	status = null,
}: Props) => {
	const buttonText =
		buttonType === 'CONFIRM'
			? 'Confirm' + (disabled ? 'ed' : '')
			: buttonType === 'DECLINE'
			? 'Decline' + (disabled ? 'd' : '')
			: 'Confirm';

	if (status === 'CONFIRMED' && buttonType === 'DECLINE') return null;
	if (status === 'DECLINED' && buttonType === 'CONFIRM') return null;

	const baseStyle = 'px-2 py-1 rounded-md';
	const buttonStyles = {
		ALL: `${baseStyle} bg-emerald-500 text-white border border-emerald-500 hover:bg-emerald-600 hover:border-emerald-600`,
		CONFIRM: `${baseStyle} bg-emerald-500 text-white border border-emerald-500 hover:bg-emerald-600 hover:border-emerald-600`,
		DECLINE: `${baseStyle} bg-transparent text-red-400 border border-red-400 font-medium`,
	};

	const disabledButtonStyles = {
		ALL: `${baseStyle} bg-gray-400 text-white border border-gray-400`,
		CONFIRM: `${baseStyle} bg-emerald-100 text-emerald-500 border border-emerald-100 font-medium`,
		DECLINE: `${baseStyle} bg-red-100 text-red-500 border border-red-100 font-medium`,
	};

	const getButtonStyle = () => {
		if (disabled) {
			return disabledButtonStyles[buttonType];
		}
		return buttonStyles[buttonType] || buttonStyles['ALL'];
	};

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={getButtonStyle()}
		>
			{buttonText}
		</button>
	);
};

export default StatusButton;

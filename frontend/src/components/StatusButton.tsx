import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
	onClick: () => void;
	disabled?: boolean;
	show?: boolean;
	buttonType: 'CONFIRM' | 'DECLINE';
}

const StatusButton = ({
	children,
	onClick,
	disabled = false,
	buttonType,
	show = true,
}: Props) => {
	if (!show && !disabled) return null;

	const baseStyle = 'px-2 py-1 rounded-md';
	const buttonStyles = {
		default: `${baseStyle} bg-gray-800 hover:bg-green-900 text-white`,
		CONFIRM: `${baseStyle} bg-green-500 hover:bg-green-600 text-white`,
		DECLINE: `${baseStyle} bg-red-500 hover:bg-red-600 text-white`,
	};

	const disabledButtonStyles = {
		default: `${baseStyle} bg-transparent text-gray-800 border border-gray-800`,
		CONFIRM: `${baseStyle} bg-transparent text-green-500 border border-green-500`,
		DECLINE: `${baseStyle} bg-transparent text-red-500 border border-red-500`,
	};

	const getButtonStyle = () => {
		if (disabled) {
			return disabledButtonStyles[buttonType];
		}
		return buttonStyles[buttonType] || buttonStyles['default'];
	};

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={getButtonStyle()}
		>
			{children}
		</button>
	);
};

export default StatusButton;

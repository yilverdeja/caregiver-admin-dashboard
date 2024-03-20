import { Shift } from '../store';

interface Props {
	role: Shift['role'];
}

const baseStyle = 'flex w-3 h-3 rounded-full';
const styles = {
	default: `${baseStyle} bg-transparent border border-red-500`,
	EN: `${baseStyle} bg-[#f000ff]`,
	ST: `${baseStyle} bg-[#4deeea]`,
	PWH: `${baseStyle} bg-[#ffac00]`,
};

const getRoleStyle = (role: Shift['role']) => {
	return styles[role] || styles['default'];
};

const ShiftRole = ({ role }: Props) => {
	return (
		<div className="flex flex-row gap-2 items-center my-1">
			<span className={getRoleStyle(role)}></span>
			<p>{role}</p>
		</div>
	);
};

export default ShiftRole;

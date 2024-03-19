interface Props {
	checked: boolean;
	onToggle: () => void;
	disabled?: boolean;
}

const Checkbox = ({ checked, onToggle, disabled = false }: Props) => {
	return (
		<input
			type="checkbox"
			className="w-5 h-5"
			checked={checked && !disabled}
			onChange={onToggle}
			disabled={disabled}
		/>
	);
};

export default Checkbox;

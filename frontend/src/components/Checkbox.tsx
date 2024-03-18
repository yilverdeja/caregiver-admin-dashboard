interface Props {
	checked: boolean;
	onToggle: () => void;
}

const Checkbox = ({ checked, onToggle }: Props) => {
	return (
		<input
			type="checkbox"
			className="w-5 h-5"
			checked={checked}
			onChange={onToggle}
		/>
	);
};

export default Checkbox;

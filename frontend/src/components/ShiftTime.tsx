interface Props {
	start: string;
	end: string;
	roundTo5Mins?: boolean;
}
const ShiftTime = ({ start, end, roundTo5Mins = false }: Props) => {
	const dateToString = (dt: string) => {
		const dtDate = new Date(dt);
		if (roundTo5Mins) {
			const coeff = 1000 * 60 * 5;
			const roundedDate = new Date(
				Math.round(dtDate.getTime() / coeff) * coeff
			);
			return roundedDate.toLocaleString('en-US', {
				timeStyle: 'short',
			});
		}

		return dtDate.toLocaleString('en-US', {
			timeStyle: 'short',
		});
	};

	return (
		<p className="my-1">
			{dateToString(start)}-{dateToString(end)}
		</p>
	);
};

export default ShiftTime;

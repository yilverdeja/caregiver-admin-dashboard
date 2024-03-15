import { useEffect, useState } from 'react';
import { Shift } from '../hooks/useShifts';

interface Props {
	title: string;
	shifts: Shift[];
}

const ShiftsMonthView = ({ title, shifts }: Props) => {
	const shiftsLength = shifts.length;
	const [shiftsByDate, setShiftsByDate] = useState({});

	// groups by day
	useEffect(() => {
		setShiftsByDate(
			shifts.reduce((accum, shift) => {
				const dt = new Date(shift.startedAt);
				// const dt_key: string = `${dt.getMonth()}-${dt.getFullYear()}`;
				const dt_key: string = dt.toLocaleString('en-US', {
					day: 'numeric',
				});
				if (dt_key in accum) {
					accum[dt_key].push(shift);
				} else {
					accum[dt_key] = [shift];
				}
				return accum;
			}, {})
		);
	}, [shifts]);

	return (
		<div className="w-full rounded-md overflow-hidden">
			<header className="flex flex-row gap-2 bg-gray-200 px-2 py-2">
				<input type="checkbox" />
				<div className="flex flex-row flex-wrap flex-grow gap-y-1 gap-x-2 items-center">
					<h2>{title}</h2>
					<p>
						({shiftsLength} held shift
						{shiftsLength === 1 ? '' : 's'})
					</p>
				</div>
				<button className="bg-green-600 text-white px-2 py-1 rounded-md">
					Confirm
				</button>
			</header>

			{/* shift card */}
			{Object.entries(shiftsByDate).map(([key, value]) => (
				<div key={key}>
					<div className="bg-gray-100 px-2">
						{key} {title}
					</div>
					{value.map((shift: Shift, index: number) => (
						<div
							key={index}
							className="flex flex-row items-center px-2"
						>
							<input type="checkbox" className="mx-4" />
							<div className="flex-grow flex flex-col my-2">
								<p className="my-1">
									{new Date(shift.startedAt).toLocaleString(
										'en-US',
										{
											timeStyle: 'short',
										}
									)}
									-
									{new Date(shift.endedAt).toLocaleString(
										'en-US',
										{
											timeStyle: 'short',
										}
									)}
								</p>
								<p className="my-1">
									{shift.userId} - {shift.lastName}{' '}
									{shift.firstName} {shift.chiName}
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
					))}
				</div>
			))}
		</div>
	);
};

export default ShiftsMonthView;

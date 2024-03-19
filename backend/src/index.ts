import express, { Request, Response } from 'express';
import cors from 'cors';
import base_shifts from '../data/shifts';

export interface Shift {
	id: number; // id property to define a shift
	startedAt: string;
	endedAt: string;
	status: 'DECLINED' | 'CONFIRMED' | 'PENDING';
	userId: number;
	chiName: string;
	lastName: string;
	firstName: string;
	role: 'EN' | 'ST' | 'PWH';
}

type NoIdShifts = Omit<Shift, 'id'>[];

let shifts: Shift[] = (base_shifts as NoIdShifts)
	.map((ss, index) => ({
		...ss,
		id: index,
	}))
	.sort(
		(a, b) =>
			new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
	);

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/shifts', (req, res) => {
	res.json(shifts);
});

app.get('/api/shifts/:id', (req, res) => {
	const { id } = req.params;
	const shift = shifts.find((shift) => shift?.id?.toString() === id);
	if (!shift) {
		return res.status(404).json({ message: 'Shift not found' });
	}
	res.json(shift);
});

app.patch('/api/shifts/:id', (req, res) => {
	const { id } = req.params;
	const { status } = req.body;

	// check if the new status if one of the allowed values
	const allowedStatuses = ['CONFIRMED', 'DECLINED'];
	if (!allowedStatuses.includes(status)) {
		return res.status(400).json({ message: 'Invalid status value' });
	}

	// check if the shift exists
	const shift = shifts.find((shift) => shift?.id?.toString() === id);
	if (!shift) {
		return res.status(404).json({ message: 'Shift not found' });
	}

	// ensures that the current status is "PENDING" before it is updated to the allowed status
	if (shift.status !== 'PENDING') {
		return res.status(409).json({
			message:
				'Shift status is not PENDING therefore status update is not allowed',
		});
	}

	// update status
	shift.status = status;
	res.json(shift);
});

app.patch(
	'/api/shifts',
	(
		req: Request<
			{},
			{},
			{ ids: number[]; status: 'CONFIRMED' | 'PENDING' | 'DECLINED' }
		>,
		res: Response
	) => {
		const { ids, status } = req.body;

		// TODO: handle shifts that are not pending (should not be updated, but it should update the rest and return a message ? )
		const updatedShifts = ids
			.map((id) => {
				const shift = shifts.find((shift) => shift.id === id);
				if (shift) {
					shift.status = status;
				}
				return shift;
			})
			.filter(Boolean); // Remove undefined entries

		if (updatedShifts.length !== ids.length) {
			return res.status(404).json({ message: 'Some shifts not found' });
		}

		res.json(updatedShifts);
	}
);

app.listen(5001, () => {
	console.log('Server running on localhost:5001');
});

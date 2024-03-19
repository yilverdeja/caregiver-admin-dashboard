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
			{ ids: number[]; status: 'CONFIRMED' | 'DECLINED' }
		>,
		res: Response
	) => {
		const { ids, status } = req.body;

		let notFoundsIds: number[] = [];
		let skippedIds: number[] = [];
		let updatedShifts: Shift[] = [];

		ids.forEach((id) => {
			const shift = shifts.find((s) => s.id === id);
			if (!shift) {
				notFoundsIds.push(id);
			} else if (shift.status !== 'PENDING') {
				skippedIds.push(id);
			} else {
				shift.status = status;
				updatedShifts.push(shift);
			}
		});

		let error: Record<string, string | number[]> = {};
		let errorMessage = [];

		if (notFoundsIds.length > 0) {
			errorMessage.push('Some shifts were not found');
			error['notFoundsIds'] = notFoundsIds;
		}
		if (skippedIds.length > 0) {
			errorMessage.push(
				'Some shifts were not updated due to their non-PENDING status'
			);
			error['skippedIds'] = skippedIds;
		}

		if (errorMessage.length > 0)
			error['message'] = errorMessage.join(' & ');

		// if no shifts are updated, and there are only errors return the error object with the correct error code
		if (Object.keys(error).length > 0 && updatedShifts.length === 0) {
			const statusCode = notFoundsIds.length === ids.length ? 404 : 409;
			return res.status(statusCode).json({ error });
		}

		// if there are shifts with some errors, then return the updated shifts along with the error object
		if (Object.keys(error).length > 0) {
			return res.json({ data: updatedShifts, error });
		}

		// if there are no errors, return the updated shifts
		res.json({ data: updatedShifts });
	}
);

app.listen(5001, () => {
	console.log('Server running on localhost:5001');
});

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

// the current shifts.ts file does not contain shiftIds, and it's not sorted
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

// GET all shifts
app.get('/api/shifts', (req, res) => {
	res.json(shifts);
});

// GET shift by ID
app.get('/api/shifts/:id', (req, res) => {
	const { id } = req.params;
	const shift = shifts.find((shift) => shift?.id?.toString() === id);
	if (!shift) {
		return res.status(404).json({ message: 'Shift not found' });
	}
	res.json(shift);
});

// PATCH update shift status by ID
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

// PATCH update multiple shifts statuses by ID
app.patch('/api/shifts', (req, res) => {
	const { ids, status }: { ids: number[]; status: Shift['status'] } =
		req.body;

	let updatedShifts: Shift[] = [];
	let notFoundIds: number[] = [];
	let skippedIds: number[] = [];

	ids.forEach((id) => {
		// updates shift status to confirmed or declined if pending
		const shift = shifts.find((s) => s.id === id);
		if (!shift) {
			// shift does not exist
			notFoundIds.push(id);
		} else if (shift.status !== 'PENDING') {
			// shift status is not pending
			skippedIds.push(id);
		} else {
			// shift exists and status is pending
			shift.status = status;
			updatedShifts.push(shift);
		}
	});

	let error = {};
	if (notFoundIds.length > 0 || skippedIds.length > 0) {
		const errorMessages = [];
		if (notFoundIds.length > 0)
			errorMessages.push('Some shifts were not found');
		if (skippedIds.length > 0)
			errorMessages.push(
				'Some shifts were not updated due to their non-PENDING status'
			);
		error = {
			message: errorMessages.join(' & '),
			notFoundIds,
			skippedIds,
		};

		if (updatedShifts.length === 0) {
			const statusCode = notFoundIds.length === ids.length ? 404 : 409;
			return res.status(statusCode).json({ error });
		}
	}

	if (Object.keys(error).length > 0) res.json({ updatedShifts, error });
	else res.json({ updatedShifts });
});

app.listen(5001, () => {
	console.log('Server running on localhost:5001');
});

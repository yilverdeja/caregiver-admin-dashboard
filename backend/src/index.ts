import express, { Request, Response } from 'express';
import cors from 'cors';
import shifts from '../data/shifts';

export interface Shift {
	id?: number; // id property to define a shift
	startedAt: string;
	endedAt: string;
	status: 'DECLINED' | 'CONFIRMED' | 'PENDING';
	userId: number;
	chiName: string;
	lastName: string;
	firstName: string;
	role: 'EN' | 'ST' | 'PWH';
}

let sandwich: Shift[] = (shifts as Shift[]).map((ss, index) => ({
	...ss,
	id: index,
}));

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/data', async (req, res) => {
	res.json({ message: 'success!' });
});

app.get('/api/shifts', (req, res) => {
	res.json(sandwich);
});

app.get('/api/shifts/:id', (req, res) => {
	const { id } = req.params;
	const shift = sandwich.find((shift) => shift?.id?.toString() === id);
	if (!shift) {
		return res.status(404).json({ message: 'Shift not found' });
	}
	res.json(shift);
});

app.patch('/api/shifts/:id', (req, res) => {
	const { id } = req.params;
	const { status } = req.body;

	const shift = sandwich.find((shift) => shift?.id?.toString() === id);
	if (!shift) {
		return res.status(404).json({ message: 'Shift not found' });
	}

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
				const shift = sandwich.find((shift) => shift.id === id);
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

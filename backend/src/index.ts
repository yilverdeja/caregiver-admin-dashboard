import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/data', async (req, res) => {
	res.json({ message: 'success!' });
});

app.listen(5001, () => {
	console.log('Server running on localhost:5001');
});

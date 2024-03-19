import axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:5001/api',
});

class APIClient<T> {
	endpoint: string;

	constructor(endpoint: string) {
		this.endpoint = endpoint;
	}

	getAllShifts = (config: AxiosRequestConfig) => {
		return axiosInstance
			.get<T[]>(this.endpoint, config)
			.then((res) => res.data);
	};

	getShift = (id: number) => {
		return axiosInstance
			.get<T>(this.endpoint + '/' + id)
			.then((res) => res.data);
	};

	updateShiftStatus = (
		id: number,
		status: 'CONFIRMED' | 'PENDING' | 'DECLINE'
	) => {
		return axiosInstance
			.patch<T>(this.endpoint + '/' + id, { status })
			.then((res) => res.data);
	};

	confirmShifts = (ids: number[]) => {
		return axiosInstance
			.patch<T[]>(this.endpoint, {
				ids,
				status: 'CONFIRMED',
			})
			.then((res) => res.data);
	};
}

export default APIClient;

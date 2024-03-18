import axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:5001/api',
});

class APIClient {
	endpoint: string;

	constructor(endpoint: string) {
		this.endpoint = endpoint;
	}

	getAll = (config: AxiosRequestConfig) => {
		return axiosInstance
			.get(this.endpoint, config)
			.then((res) => console.log(res.data));
	};

	get = (id: number) => {
		return axiosInstance
			.get(this.endpoint + '/' + id)
			.then((res) => console.log(res.data));
	};

	// TODO: update status of single id

	// TODO: update status of multiple ids
}

export default APIClient;

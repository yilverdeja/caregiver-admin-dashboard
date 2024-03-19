import { Shift } from './../store';
import { useQuery } from '@tanstack/react-query';
import APIClient from '../services/api-client';

const apiClient = new APIClient<Shift>('/shifts');

const useShifts = () =>
	useQuery({
		queryKey: ['shifts'],
		queryFn: apiClient.getAllShifts,
	});

export default useShifts;

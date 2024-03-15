import shifts from '../data/shifts';

export interface Shift {
	startedAt: string;
	endedAt: string;
	status: 'DECLINED' | 'CONFIRMED' | 'PENDING';
	userId: number;
	chiName: string;
	lastName: string;
	firstName: string;
	role: 'EN' | 'ST' | 'PWH';
}

const useShifts = () => ({
	data: shifts as Shift[],
	isLoading: false,
	error: null,
});

export default useShifts;

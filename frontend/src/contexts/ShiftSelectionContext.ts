import { createContext } from 'react';
import { SelectedShifts } from '../components/ShiftsMonthView';

interface ShiftSelectionContextProps {
	isAllChecked: boolean;
	selectedShifts: SelectedShifts;
	toggleShift: (shiftId: number) => void;
	toggleAll: () => void;
	setAllChecked: (checked: boolean) => void;
}

const ShiftSelectionContext = createContext<ShiftSelectionContextProps>({
	isAllChecked: false,
	selectedShifts: {},
	toggleShift: () => {},
	toggleAll: () => {},
	setAllChecked: () => {},
});

export default ShiftSelectionContext;

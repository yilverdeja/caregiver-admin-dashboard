import LegendIndicator from './components/LegendIndicator';
import SearchCaregiver from './components/SearchCaregiver';
import ShiftsView from './components/ShiftsView';
import { useShiftStore } from './store';

function App() {
	const { setSearchTerm } = useShiftStore();
	return (
		<>
			<LegendIndicator />
			<SearchCaregiver onSearch={(text) => setSearchTerm(text)} />
			<ShiftsView />
		</>
	);
}

export default App;

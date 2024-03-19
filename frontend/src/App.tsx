import LegendIndicator from './components/LegendIndicator';
import SearchCaregiver from './components/SearchCaregiver';
import ShiftsView from './components/ShiftsView';
import { useShiftStore } from './store';

function App() {
	const { setSearchTerm } = useShiftStore();
	return (
		<div className="flex flex-col sm:h-screen p-4 sm:p-8 gap-4">
			<div className="flex-none">
				<LegendIndicator />
				<SearchCaregiver onSearch={(text) => setSearchTerm(text)} />
			</div>
			<div className="flex-grow overflow-hidden">
				<ShiftsView />
			</div>
		</div>
	);
}

export default App;

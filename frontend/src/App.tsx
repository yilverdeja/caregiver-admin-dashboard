import LegendIndicator from './components/LegendIndicator';
import SearchCaregiver from './components/SearchCaregiver';
import ShiftsView from './components/ShiftsView';
import { useShiftStore } from './store';

function App() {
	const { setSearchTerm } = useShiftStore();
	return (
		<div className="flex flex-col sm:h-screen p-4 sm:p-8 gap-4">
			<header className="flex-none sticky top-0 bg-white pb-4 border-b-2 border-gray-100 sm:border-none sm:pb-0">
				<LegendIndicator />
				<SearchCaregiver onSearch={(text) => setSearchTerm(text)} />
			</header>
			<div className="flex-grow overflow-hidden">
				<ShiftsView />
			</div>
		</div>
	);
}

export default App;

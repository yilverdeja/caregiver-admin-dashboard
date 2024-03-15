import { useState } from 'react';
import LegendIndicator from './components/LegendIndicator';
import SearchCaregiver from './components/SearchCaregiver';
import ShiftsView from './components/ShiftsView';

function App() {
	const [searchText, setSearchText] = useState('');
	return (
		<>
			<LegendIndicator />
			<SearchCaregiver onSearch={(text) => setSearchText(text)} />
			<ShiftsView searchText={searchText} />
		</>
	);
}

export default App;

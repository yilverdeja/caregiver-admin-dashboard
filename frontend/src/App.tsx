import LegendIndicator from './components/LegendIndicator';
import SearchCaregiver from './components/SearchCaregiver';

function App() {
	return (
		<>
			<LegendIndicator />
			<SearchCaregiver
				onSearch={(searchText) => {
					console.log(searchText);
				}}
			/>
			{/* Month Cards */}
		</>
	);
}

export default App;

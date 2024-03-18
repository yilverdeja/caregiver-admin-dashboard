import { FaMagnifyingGlass } from 'react-icons/fa6';

interface Props {
	onSearch: (searchText: string) => void;
}

const SearchCaregiver = ({ onSearch }: Props) => {
	return (
		<div className="flex flex-col sm:flex-row whitespace-nowrap gap-4 justify-start sm:items-center">
			<label
				htmlFor="search"
				className="block text-lg font-medium text-gray-800"
			>
				Caregiver Name
			</label>
			<div className="relative text-gray-400 focus-within:text-gray-600 block">
				<input
					type="text"
					name="search"
					onChange={(event) => onSearch(event?.target.value)}
					className="pl-4 pr-10 py-2 border rounded-lg placeholder-gray-400 text-gray-800 appearance-none w-full focus:outline-none"
					placeholder="Search"
				/>
				<FaMagnifyingGlass
					size={20}
					color="gray"
					className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 right-3"
				/>
			</div>
		</div>
	);
};

export default SearchCaregiver;

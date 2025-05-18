import { useState } from 'react';
// NOTE TO SELF - If icons don't work, use the local copy from ASSets
import { MapPin, ArrowRight } from 'lucide-react';

const SearchBar = () => {
  const [query, setQuery] = useState<string>('');

  // Handle Input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Search Logic - MOCK
      console.log('Search Query:', query);
      setQuery(''); // Clear Input
    }
  };

  // Component Design
  return (
    <form
      onSubmit={handleSearch}
      className="focus-within:ring-primary mx-auto flex w-full max-w-md items-center justify-between rounded-full border border-gray-300 bg-white py-2 pr-2 pl-4 shadow-sm focus-within:ring-2"
    >
      <MapPin color="gray" height={25} width={22} />
      <input
        type="text"
        value={query}
        onChange={handleInput}
        placeholder="Search Destinations"
        className="grow px-3 py-2 text-base placeholder-gray-400 outline-none"
      />
      <button
        type="submit"
        className="bg-primary flex h-12 w-12 items-center justify-center rounded-full"
      >
        <ArrowRight color="white" height={30} width={30} />
      </button>
    </form>
  );
};

export default SearchBar;

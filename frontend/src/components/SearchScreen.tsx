import { useState } from 'react';
import backgroundImage from '../assets/Background.jpg';
import SearchBar from './common/SearchBar';
import FlipText from './FlipText';

type SearchType = 'events-experiences' | 'adventures';

function SearchScreen() {
  const [searchType, setSearchType] = useState<SearchType>('events-experiences');

  return (
    <section className="relative h-[94vh] w-full md:p-4 md:bg-[#f2f2f2]">
      {/* Container - only on desktop */}
      <div className="relative h-full w-full md:rounded-[20px] md:overflow-hidden">
        {/* Background with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl text-center">
            <h1 className="font-tpc mb-4 text-4xl leading-tight font-semibold text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
              Choose Your Next
              <br />
              <FlipText 
                searchType={searchType}
                className="min-w-[300px]"
              />
            </h1>
            <p className="font-tpc mb-8 text-base text-white/90 drop-shadow-lg sm:text-lg md:text-xl" style={{ textShadow: '1px 2px 10px rgba(0, 0, 0, 0.8)' }}>
              Journeys start where comfort ends
            </p>

            <div className="relative mx-auto max-w-2xl">
              <SearchBar onSearchTypeChange={setSearchType} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchScreen;

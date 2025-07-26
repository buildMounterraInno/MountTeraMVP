import backgroundImage from '../assets/Background.jpg';
import SearchBar from './common/SearchBar';

function SearchScreen() {
  return (
    <section className="relative h-[94vh] w-full overflow-visible">
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
            Adventure
          </h1>
          <p className="font-tpc mb-8 text-base text-white/90 drop-shadow-lg sm:text-lg md:text-xl" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
            Journeys start where comfort ends
          </p>

          <div className="relative mx-auto max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchScreen;

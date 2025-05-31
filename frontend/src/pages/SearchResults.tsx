import { useLocation } from 'react-router-dom';
import { treks } from '../data/trek';
import { Link } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import backgroundImage from '../assets/Background.jpg';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('destination') || '';

  // Filter treks based on search query
  const filteredTreks = treks.filter((trek) =>
    trek.placeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Fixed Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-100"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-26">
        <div className="py-8">
          <div className="container mx-auto">
            <SearchBar />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold text-white">
            {filteredTreks.length > 0
              ? `Search Results for "${searchQuery}"`
              : 'More Treks to be added soon'}
          </h1>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(filteredTreks.length > 0 ? filteredTreks : treks).map((trek) => (
              <Link key={trek.id} to={trek.pageUrl}>
                <div
                  className="relative h-64 overflow-hidden rounded-lg bg-cover bg-center transition-transform hover:scale-105"
                  style={{ backgroundImage: `url(${trek.destinationImage})` }}
                >
                  <div className="absolute inset-0 bg-black/30 transition-opacity hover:bg-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="text-xl font-semibold drop-shadow-lg">
                      {trek.placeName}
                    </h2>
                    <p className="mt-1 drop-shadow-lg">{trek.state}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

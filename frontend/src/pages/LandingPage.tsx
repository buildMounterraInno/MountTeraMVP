import backgroundImage from '../assets/Background.jpg';
import SearchBar from '../components/common/SearchBar';

const LandingPage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content container */}
      <div className="relative flex h-full items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-tpc mb-2 text-4xl font-[600] text-white drop-shadow-lg md:text-5xl lg:text-6xl">
            Choose Your Next
          </h1>
          <h1 className="font-tpc mb-2 text-4xl font-[600] text-white drop-shadow-lg md:text-5xl lg:text-6xl">
            Adventure
          </h1>
          <p className="font-tpc mb-8 text-base text-white drop-shadow-md md:text-lg">
            Journeys start where comfort ends
          </p>

          {/* Search component */}
          <div className="mx-auto max-w-md">
            <div className="relative flex items-center">
              {/* HERE!!!!!!!! */}
              <SearchBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

import { type Trek, treks } from '../../data/trek.ts';

const TrekTile: React.FC<Trek> = ({
  destinationImage,
  placeName,
  state,
  coordinates,
}) => {
  return (
    <article
      className="relative h-50 overflow-hidden rounded-lg bg-cover bg-center p-4 text-white shadow-md transition-shadow hover:shadow-lg"
      style={{ backgroundImage: `url(${destinationImage})` }}
      aria-labelledby={`trek-title-${placeName}`}
    >
      {/* Overlay for gradient */}
      <div className="to-[#D9D9D9]-200/10 absolute inset-0 z-0 bg-gradient-to-t from-black/40"></div>

      <div className="absolute bottom-3 left-3 z-10">
        <h3
          id={`trek-title-${placeName}`}
          className="text-lg font-semibold text-white"
        >
          {placeName}
        </h3>
        <p className="text-sm text-white/90">{state}</p>
        <p className="text-sm text-white/80">{coordinates}</p>
      </div>
    </article>
  );
};

const Treks: React.FC = () => {
  const displayedTreks = treks.slice(0, 6);

  return (
    <section className="rounded-lg bg-gray-100 p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        Unforgettable Adventure Awaits
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedTreks.map((trek) => (
          <TrekTile key={trek.id} {...trek} />
        ))}
      </div>
    </section>
  );
};

export default Treks;

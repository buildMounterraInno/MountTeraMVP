import { type Trek, treks } from '../../data/trek.ts';

const TrekTile: React.FC<Trek> = ({
  destinationImage,
  placeName,
  state,
  coordinates,
}) => {
  return (
    <article
      className="rounded-lg bg-transparent p-4 shadow-md transition-shadow hover:shadow-lg"
      aria-labelledby={`trek-title-${placeName}`}
    >
      <img
        src={destinationImage}
        alt={`${placeName} landscape`}
        className="mb-3 h-32 w-full rounded-md object-cover"
        loading="lazy"
      />
      <h3
        id={`trek-title-${placeName}`}
        className="text-lg font-semibold text-gray-800"
      >
        {placeName}
      </h3>
      <p className="text-sm text-gray-600">{state}</p>
      <p className="text-sm text-gray-500">{coordinates}</p>
    </article>
  );
};

const Treks: React.FC = () => {
  const displayedTreks = treks.slice(0, 6);

  return (
    <section className="rounded-lg bg-gray-100 p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Popular Treks</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedTreks.map((trek) => (
          <TrekTile key={trek.id} {...trek} />
        ))}
      </div>
    </section>
  );
};

export default Treks;

import { type Trek, treks } from '../../data/trek.ts';
import { Link } from 'react-router-dom';

const TrekTile: React.FC<Trek> = ({
  destinationImage,
  placeName,
  state,
  coordinates,
  pageUrl,
}) => {
  return (
    <Link to={pageUrl} className="block">
      <article
        className="relative h-50 overflow-hidden rounded-lg bg-cover bg-center p-4 text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2 hover:ring-[#F2F2F2]/50"
        style={{ backgroundImage: `url(${destinationImage})` }}
        aria-labelledby={`trek-title-${placeName}`}
      >
        {/* Overlay for gradient */}
        <div className="to-[#D9D9D9]-200/10 absolute inset-0 z-0 bg-gradient-to-t from-black/40 transition-opacity duration-300 hover:from-black/50"></div>

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
    </Link>
  );
};

const ActivityCard: React.FC<{
  image: string;
  title: string;
  onClick: () => void;
}> = ({ image, title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center flex-shrink-0 text-center group"
    >
      <div className="w-20 h-20 mb-3 overflow-hidden rounded-full ring-4 ring-white shadow-lg group-hover:shadow-xl transition-shadow duration-200">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
        {title}
      </span>
    </button>
  );
};

const Treks: React.FC = () => {
  const displayedTreks = treks.slice(0, 6);

  const activities = [
    {
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&h=200&fit=crop&crop=center",
      title: "Hiking"
    },
    {
      image: "https://images.unsplash.com/photo-1464822759844-d150baec93d5?w=200&h=200&fit=crop&crop=center",
      title: "Mountain Biking"
    },
    {
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center",
      title: "Trekking"
    },
    {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
      title: "Rock Climbing"
    },
    {
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=200&h=200&fit=crop&crop=center",
      title: "Trail Running"
    },
    {
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop&crop=center",
      title: "Camping"
    },
    {
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop&crop=center",
      title: "Photography"
    },
    {
      image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=200&h=200&fit=crop&crop=center",
      title: "Nature Walks"
    },
    {
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center",
      title: "Backpacking"
    },
    {
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop&crop=center",
      title: "Wildlife Viewing"
    }
  ];

  const handleActivityClick = (activityTitle: string) => {
    // Handle activity click - could navigate to filtered results
    console.log(`Clicked on ${activityTitle}`);
  };

  return (
    <div className="space-y-12">
      {/* Browse by Activity Section */}
      <section className="bg-white">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Browse by activity
          </h2>
        </div>
        
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scroll-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`
              .scroll-hidden::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {activities.map((activity, index) => (
              <ActivityCard
                key={index}
                image={activity.image}
                title={activity.title}
                onClick={() => handleActivityClick(activity.title)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Unforgettable Adventure Awaits Section */}
      <section className="rounded-lg bg-gray-200 p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Unforgettable Adventure Awaits
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedTreks.map((trek) => (
            <TrekTile key={trek.id} {...trek} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Treks;

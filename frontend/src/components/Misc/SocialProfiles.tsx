import { type Social, socials } from '../../data/socialProfile';

const SocialTile: React.FC<Social> = ({
  backgroundImage,
  profileName,
  city,
  country,
}) => {
  return (
    <article
      className="relative h-40 w-50 overflow-hidden rounded-lg bg-cover bg-center p-4 text-white shadow-md transition-shadow hover:shadow-lg sm:h-45 sm:w-55"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      aria-labelledby={`trek-title-${profileName}`}
    >
      {/* Overlay for gradient */}
      <div className="to-[#D9D9D9]-200/10 absolute inset-0 z-0 bg-gradient-to-t from-black/40"></div>

      <div className="absolute bottom-3 left-3 z-10">
        <h3
          id={`trek-title-${profileName}`}
          className="text-lg font-semibold text-white"
        >
          {profileName}
        </h3>
        <p className="text-sm text-white/90">
          {city}, {country}
        </p>
      </div>
    </article>
  );
};

const SocialProfiles = () => {
  const displayedProfiles = socials.slice(0, 6);

  return (
    <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-6">
      {displayedProfiles.map((event) => (
        <SocialTile key={event.id} {...event} />
      ))}
    </div>
  );
};

export default SocialProfiles;

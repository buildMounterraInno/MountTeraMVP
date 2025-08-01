import { type Experience, experiences } from '../../data/experience';
import { type Event, events } from '../../data/events';

const ExperienceTile: React.FC<Experience> = ({
  destinationImage,
  catchPhrase,
  state,
  price,
}) => {
  return (
    <article
      className="relative h-50 overflow-hidden rounded-lg bg-cover bg-center p-4 text-white shadow-md transition-shadow hover:shadow-lg"
      style={{ backgroundImage: `url(${destinationImage})` }}
      aria-labelledby={`experience-title-${catchPhrase}`}
    >
      {/* Overlay for gradient */}
      <div className="to-[#D9D9D9]-200/10 absolute inset-0 z-0 bg-gradient-to-t from-black/40"></div>

      <div className="absolute bottom-3 left-3 z-10">
        <h3
          id={`experience-title-${catchPhrase}`}
          className="text-lg font-semibold text-white"
        >
          {catchPhrase}
        </h3>
        <p className="text-sm text-white/90">{state}</p>
        <p className="text-sm text-white/80">{price}</p>
      </div>
    </article>
  );
};

const EventTile: React.FC<Event> = ({
  destinationImage,
  catchPhrase,
  state,
}) => {
  return (
    <article
      className="relative h-50 overflow-hidden rounded-lg bg-cover bg-center p-4 text-white shadow-md transition-shadow hover:shadow-lg"
      style={{ backgroundImage: `url(${destinationImage})` }}
      aria-labelledby={`event-title-${catchPhrase}`}
    >
      {/* Overlay for gradient */}
      <div className="to-[#D9D9D9]-200/10 absolute inset-0 z-0 bg-gradient-to-t from-black/40"></div>

      <div className="absolute bottom-3 left-3 z-10">
        <h3
          id={`event-title-${catchPhrase}`}
          className="text-lg font-semibold text-white"
        >
          {catchPhrase}
        </h3>
        <p className="text-sm text-white/90">{state}</p>
      </div>
    </article>
  );
};

const EventsAndExperiences = () => {
  const displayedExperiences = experiences.slice(0, 3);
  const displayedEvents = events.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Experiences Section */}
      <section className="rounded-lg bg-gray-200 p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Experience the Magic
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedExperiences.map((experience) => (
            <ExperienceTile key={`exp-${experience.id}`} {...experience} />
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section className="rounded-lg bg-gray-200 p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Enjoy the local Events around you
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedEvents.map((event) => (
            <EventTile key={`event-${event.id}`} {...event} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventsAndExperiences;
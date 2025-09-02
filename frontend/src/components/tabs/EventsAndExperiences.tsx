import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'phosphor-react';
import { NearbyApiService, type LocationCoordinates, type NearbyEventsResponse, type NearbyExperiencesResponse, type NearbyEventItem, type NearbyExperienceItem } from '../../services/nearby-api';
import EventCard from '../cards/EventCard';
import ExperienceCard from '../cards/ExperienceCard';
import CardCarousel from '../ui/CardCarousel';

const EventsAndExperiences = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [eventsData, setEventsData] = useState<NearbyEventsResponse | null>(null);
  const [experiencesData, setExperiencesData] = useState<NearbyExperiencesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Request location permission and fetch data
  const handleGetLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get user's current location
      const coordinates = await NearbyApiService.getCurrentLocation();
      setLocation(coordinates);
      setLocationPermission('granted');

      // Fetch nearby events and experiences
      const { events, experiences } = await NearbyApiService.getNearbyEventsAndExperiences(coordinates);
      setEventsData(events);
      setExperiencesData(experiences);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location or fetch data';
      setError(errorMessage);
      
      if (errorMessage.includes('denied')) {
        setLocationPermission('denied');
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-request location on component mount
  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleEventCardClick = (eventId: string) => {
    navigate(`/booking/event/${eventId}`);
  };

  const handleExperienceCardClick = (experienceId: string) => {
    navigate(`/booking/experience/${experienceId}`);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <CardCarousel 
          title="The Beat Around You" 
          subtitle="Events that you cannot miss"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-96 h-[480px] bg-white rounded-xl shadow-xl animate-pulse">
              <div className="h-60 bg-gray-300 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </CardCarousel>

        <CardCarousel 
          title="The Vibe Around You" 
          subtitle="Immersive Experiences, curated for your senses."
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-96 h-[480px] bg-white rounded-xl shadow-xl animate-pulse">
              <div className="h-60 bg-gray-300 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </CardCarousel>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Unable to Load Content</h2>
          <p className="text-red-600 mb-4">Error: {error}</p>
          {locationPermission === 'denied' && (
            <p className="text-sm text-red-500 mb-4">Please enable location access and refresh the page.</p>
          )}
          <button 
            onClick={handleGetLocation}
            className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Events Carousel */}
      <CardCarousel 
        title="The Beat Around You" 
        subtitle="Events that you cannot miss"
      >
        {eventsData && eventsData.events && eventsData.events.length > 0 ? (
          eventsData.events.map((eventItem: NearbyEventItem) => (
            <EventCard 
              key={eventItem.id}
              eventItem={eventItem}
              onClick={handleEventCardClick}
            />
          ))
        ) : (
          <div className="w-96 h-[480px] bg-white rounded-xl shadow-xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center p-4">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">No events found nearby</p>
            </div>
          </div>
        )}
      </CardCarousel>

      {/* Experiences Carousel */}
      <CardCarousel 
        title="The Vibe Around You" 
        subtitle="Immersive Experiences, curated for your senses."
      >
        {experiencesData && experiencesData.experiences && experiencesData.experiences.length > 0 ? (
          experiencesData.experiences.map((experienceItem: NearbyExperienceItem) => (
            <ExperienceCard 
              key={experienceItem.id}
              experienceItem={experienceItem}
              onClick={handleExperienceCardClick}
            />
          ))
        ) : (
          <div className="w-96 h-[480px] bg-white rounded-xl shadow-xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center p-4">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p className="text-gray-500">No experiences found nearby</p>
            </div>
          </div>
        )}
      </CardCarousel>

      {/* Location Info - Debug Panel */}
      {location && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <MapPin size={20} weight="regular" />
            Current Location:
          </h3>
          <p className="text-blue-600">
            Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
          </p>
          {eventsData && (
            <p className="text-blue-600 mt-1">
              Found {eventsData.events?.length || 0} events, {experiencesData?.experiences?.length || 0} experiences
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsAndExperiences;
import React, { useState, useEffect } from 'react';
import { Calendar } from 'phosphor-react';
import { NearbyApiService, type NearbyEventItem, type DetailedEvent } from '../../services/nearby-api';

interface EventCardProps {
  eventItem: NearbyEventItem;
  onClick?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ eventItem, onClick }) => {
  const [eventDetails, setEventDetails] = useState<DetailedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const details = await NearbyApiService.getEventDetails(eventItem.id);
        setEventDetails(details);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventItem.id]);

  const handleClick = () => {
    if (onClick) {
      onClick(eventItem.id);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  if (loading) {
    return (
      <div className="w-80 h-[480px] bg-white rounded-xl shadow-xl animate-pulse">
        <div className="h-60 bg-gray-300 rounded-t-xl"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time
  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Build location string
  const getLocationString = () => {
    if (eventDetails?.address_city) {
      return eventDetails.address_city;
    }
    const parts = [
      eventDetails?.address_venue,
      eventDetails?.address_landmark,
      eventDetails?.address_city
    ].filter(Boolean);
    return parts.join(', ') || 'Location not specified';
  };

  return (
    <div 
      className="w-80 h-[400px] bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] flex-shrink-0 flex flex-col"
      onClick={handleClick}
    >
      {/* Banner Image - Top */}
      <div className="h-56 relative overflow-hidden rounded-2xl m-4 mb-2 flex-shrink-0">
        {/* Price Tag Overlay */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-black/70 text-white text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
            From ₹{eventDetails?.fixed_price || 0}
          </span>
        </div>
        {/* Wishlist Button */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={handleWishlistClick}
            className="p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm transform hover:scale-110 active:scale-95 bg-white/90 hover:bg-red-500 text-red-500 hover:text-white"
          >
            <svg className="w-4 h-4 transition-all duration-300" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        {imageError ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="mb-2">
                <Calendar size={32} weight="regular" className="text-white" />
              </div>
              <p className="text-sm font-medium">{eventDetails?.event_name?.substring(0, 20) || 'Event'}</p>
            </div>
          </div>
        ) : (
          <img 
            src={eventDetails?.banner_image || `https://placehold.co/384x240/3b82f6/ffffff?text=${encodeURIComponent(eventDetails?.event_name || 'Event')}`}
            alt={eventDetails?.event_name || 'Event'}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Card Content - Bottom */}
      <div className="px-5 pb-5 flex-1 flex flex-col justify-end">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
            {eventDetails?.event_name || `Event ${eventItem.id.substring(0, 8)}`}
          </h3>
          
          {eventDetails?.tagline && (
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
              {eventDetails.tagline}
            </p>
          )}

          <div className="space-y-1 pt-1">
            {eventDetails?.date && (
              <div className="flex items-center text-gray-500 text-xs">
                <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                {formatDate(eventDetails.date)} • {formatTime(eventDetails.start_time)}
              </div>
            )}

            <div className="flex items-center text-gray-500 text-xs">
              <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {getLocationString()}
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-500 bg-red-50 p-1 rounded">
              API Error
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
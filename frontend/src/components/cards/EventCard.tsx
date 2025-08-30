import React, { useState, useEffect } from 'react';
import { NearbyApiService, type NearbyEventItem, type DetailedEvent } from '../../services/nearby-api';

interface EventCardProps {
  eventItem: NearbyEventItem;
  onClick?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ eventItem, onClick }) => {
  const [eventDetails, setEventDetails] = useState<DetailedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const details = await NearbyApiService.getEventDetails(eventItem.id);
        setEventDetails(details);
      } catch (err) {
        console.error('Error fetching event details:', err);
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

  if (loading) {
    return (
      <div className="w-96 h-[480px] bg-gray-200 rounded-xl shadow-md animate-pulse">
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
    if (eventDetails?.address_full_address) {
      return eventDetails.address_full_address;
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
      className="w-96 h-[480px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 flex-shrink-0"
      onClick={handleClick}
    >
      {/* Banner Image - Top */}
      <div className="h-60 relative overflow-hidden rounded-t-xl">
        <img 
          src={eventDetails?.banner_image || `https://via.placeholder.com/384x240/3b82f6/ffffff?text=${encodeURIComponent(eventDetails?.event_name || 'Event')}`}
          alt={eventDetails?.event_name || 'Event'}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.log('Image failed to load, original URL:', eventDetails?.banner_image);
            (e.target as HTMLImageElement).src = `https://via.placeholder.com/384x240/3b82f6/ffffff?text=${encodeURIComponent(eventDetails?.event_name?.substring(0, 10) || 'Event')}`;
          }}
        />
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
          {eventItem.distance_km.toFixed(1)} km away
        </div>
      </div>

      {/* Card Content - Bottom */}
      <div className="p-4 h-[220px] flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
            {eventDetails?.event_name || `Event ${eventItem.id.substring(0, 8)}`}
          </h3>
          
          {eventDetails?.tagline && (
            <p className="text-sm text-gray-600 line-clamp-2">{eventDetails.tagline}</p>
          )}
          
          <div className="flex items-start text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-2">{getLocationString()}</span>
          </div>

          {eventDetails?.date && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(eventDetails.date)} • {formatTime(eventDetails.start_time)}</span>
            </div>
          )}

          {eventDetails?.contact_name && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{eventDetails.contact_name}</span>
            </div>
          )}

          {error && (
            <div className="text-xs text-red-500 bg-red-50 p-1 rounded">
              API Error
            </div>
          )}
        </div>

        {/* Price and Category */}
        <div className="flex items-center justify-between mt-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
            {eventDetails?.primary_category || 'Event'}
          </span>
          <span className="font-bold text-lg text-green-600">
            ₹{eventDetails?.fixed_price || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
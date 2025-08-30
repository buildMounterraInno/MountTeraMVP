import React, { useState, useEffect } from 'react';
import { NearbyApiService, type NearbyExperienceItem, type DetailedExperience } from '../../services/nearby-api';

interface ExperienceCardProps {
  experienceItem: NearbyExperienceItem;
  onClick?: (experienceId: string) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experienceItem, onClick }) => {
  const [experienceDetails, setExperienceDetails] = useState<DetailedExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperienceDetails = async () => {
      try {
        setLoading(true);
        const details = await NearbyApiService.getExperienceDetails(experienceItem.id);
        setExperienceDetails(details);
      } catch (err) {
        console.error('Error fetching experience details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load experience details');
      } finally {
        setLoading(false);
      }
    };

    fetchExperienceDetails();
  }, [experienceItem.id]);

  const handleClick = () => {
    if (onClick) {
      onClick(experienceItem.id);
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

  // Format time slots
  const formatTimeSlots = () => {
    if (experienceDetails?.time_slots && experienceDetails.time_slots.length > 0) {
      const slot = experienceDetails.time_slots[0];
      return `${slot.start} - ${slot.end}`;
    }
    return 'Time not specified';
  };


  // Build location string
  const getLocationString = () => {
    if (experienceDetails?.address_full_address) {
      return experienceDetails.address_full_address;
    }
    const parts = [
      experienceDetails?.address_venue,
      experienceDetails?.address_city
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
          src={experienceDetails?.experience_photo_urls?.[0] || `https://via.placeholder.com/384x240/8b5cf6/ffffff?text=${encodeURIComponent(experienceDetails?.event_name || 'Experience')}`}
          alt={experienceDetails?.event_name || 'Experience'}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.log('Image failed to load, original URL:', experienceDetails?.experience_photo_urls?.[0]);
            (e.target as HTMLImageElement).src = `https://via.placeholder.com/384x240/8b5cf6/ffffff?text=${encodeURIComponent(experienceDetails?.event_name?.substring(0, 10) || 'Experience')}`;
          }}
        />
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
          {experienceItem.distance_km.toFixed(1)} km away
        </div>
      </div>

      {/* Card Content - Bottom */}
      <div className="p-4 h-[220px] flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
            {experienceDetails?.event_name || `Experience ${experienceItem.id.substring(0, 8)}`}
          </h3>
          
          {experienceDetails?.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{experienceDetails.description}</p>
          )}
          
          <div className="flex items-start text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-2">{getLocationString()}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatTimeSlots()}</span>
          </div>

          {experienceDetails?.emergency_contact_number && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{experienceDetails.emergency_contact_number}</span>
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
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full capitalize">
            {experienceDetails?.primary_category || 'Experience'}
          </span>
          <span className="font-bold text-lg text-green-600">
            ₹{experienceDetails?.ticket_price || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
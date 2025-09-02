import React, { useState, useEffect } from 'react';
import { Target } from 'phosphor-react';
import { NearbyApiService, type NearbyExperienceItem, type DetailedExperience } from '../../services/nearby-api';

interface ExperienceCardProps {
  experienceItem: NearbyExperienceItem;
  onClick?: (experienceId: string) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experienceItem, onClick }) => {
  const [experienceDetails, setExperienceDetails] = useState<DetailedExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchExperienceDetails = async () => {
      try {
        setLoading(true);
        const details = await NearbyApiService.getExperienceDetails(experienceItem.id);
        setExperienceDetails(details);
      } catch (err) {
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

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  if (loading) {
    return (
      <div className="w-80 h-[480px] bg-gray-200 rounded-xl shadow-md animate-pulse">
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
    if (experienceDetails?.address_city) {
      return experienceDetails.address_city;
    }
    const parts = [
      experienceDetails?.address_venue,
      experienceDetails?.address_city
    ].filter(Boolean);
    return parts.join(', ') || 'Location not specified';
  };

  return (
    <div 
      className="w-80 h-[400px] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] flex-shrink-0 flex flex-col"
      onClick={handleClick}
    >
      {/* Banner Image - Top */}
      <div className="h-56 relative overflow-hidden rounded-2xl m-4 mb-2 flex-shrink-0">
        {/* Price Tag Overlay */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-black/70 text-white text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
            From ₹{experienceDetails?.ticket_price || 0}
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
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="mb-2">
                <Target size={32} weight="regular" className="text-white" />
              </div>
              <p className="text-sm font-medium">{experienceDetails?.event_name?.substring(0, 20) || 'Experience'}</p>
            </div>
          </div>
        ) : (
          <img 
            src={experienceDetails?.experience_photo_urls?.[0] || `https://placehold.co/384x240/8b5cf6/ffffff?text=${encodeURIComponent(experienceDetails?.event_name || 'Experience')}`}
            alt={experienceDetails?.event_name || 'Experience'}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Card Content - Bottom */}
      <div className="px-5 pb-5 flex-1 flex flex-col justify-end">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
            {experienceDetails?.event_name || `Experience ${experienceItem.id.substring(0, 8)}`}
          </h3>
          
          {experienceDetails?.description && (
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
              {experienceDetails.description}
            </p>
          )}

          <div className="space-y-1 pt-1">
            <div className="flex items-center text-gray-500 text-xs">
              <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                <path d="m12.5 7-1 0v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              {formatTimeSlots()}
            </div>

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

export default ExperienceCard;
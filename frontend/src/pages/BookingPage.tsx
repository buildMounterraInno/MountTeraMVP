import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Star, Heart, Share2 } from 'lucide-react';

interface EventDetails {
  id: string;
  name: string;
  description: string;
  image: string;
  images?: string[];
  address: string;
  date?: string;
  time?: string;
  duration?: string;
  price: number | string;
  capacity?: number;
  rating?: number;
  reviews?: number;
  organizer?: string;
  amenities?: string[];
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
}

const BookingPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [guests, setGuests] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Format date to human readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  };

  // Format time to human readable format
  const formatTime = (timeString: string) => {
    try {
      // Handle both full datetime strings and time-only strings
      let date;
      if (timeString.includes('T') || timeString.includes(' ')) {
        date = new Date(timeString);
      } else {
        // If it's just time (HH:MM), create a date with today's date
        date = new Date(`2024-01-01T${timeString}`);
      }
      
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return timeString; // Return original if parsing fails
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!type || !id) return;
      
      setLoading(true);
      try {
        // Use only Vastusetu base URL with correct endpoints
        const endpoint = type === 'event' 
          ? `https://www.vastusetu.com/api/events/getevent/${id}`
          : `https://www.vastusetu.com/api/recurringevents/getrecurringevent/${id}`;
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || `Failed to fetch ${type} details - Status: ${response.status}`);
        }

        // Handle wrapped response format
        const eventData = (data.success && data.data) ? data.data : data;
        
        if (type === 'event') {
          // Map event fields according to DetailedEvent interface
          setEventDetails({
            id: eventData.id || id,
            name: eventData.event_name || eventData.name || 'Event Details',
            description: eventData.long_description || eventData.short_description || eventData.description || 'No description available.',
            image: eventData.banner_image,
            images: eventData.banner_image ? [eventData.banner_image] : [],
            address: eventData.address_full_address || `${eventData.address_venue || ''} ${eventData.address_city || ''}`.trim() || 'Location TBD',
            date: eventData.date ? formatDate(eventData.date) : undefined,
            time: eventData.start_time ? formatTime(eventData.start_time) : undefined,
            duration: eventData.duration ? `${eventData.duration} hours` : undefined,
            price: eventData.fixed_price || eventData.price || 'Contact for pricing',
            capacity: eventData.max_capacity,
            rating: 4.5, // Default rating
            reviews: 0,
            organizer: eventData.contact_name,
            amenities: [],
            highlights: eventData.tagline ? [eventData.tagline] : [],
            inclusions: [],
            exclusions: []
          });
        } else {
          // Map experience fields according to DetailedExperience interface
          setEventDetails({
            id: eventData.id || id,
            name: eventData.event_name || eventData.name || 'Experience Details',
            description: eventData.description || 'No description available.',
            image: eventData.experience_photo_urls?.[0],
            images: eventData.experience_photo_urls || [],
            address: eventData.address_full_address || `${eventData.address_venue || ''} ${eventData.address_city || ''}`.trim() || 'Location TBD',
            date: undefined, // Experiences are recurring
            time: eventData.time_slots?.[0]?.start ? formatTime(eventData.time_slots[0].start) : undefined,
            duration: eventData.time_slots?.[0] ? `${formatTime(eventData.time_slots[0].start)} - ${formatTime(eventData.time_slots[0].end)}` : undefined,
            price: eventData.ticket_price || eventData.price || 'Contact for pricing',
            capacity: eventData.max_capacity,
            rating: 4.5, // Default rating
            reviews: 0,
            organizer: eventData.contact_name,
            amenities: [],
            highlights: eventData.primary_category ? [eventData.primary_category] : [],
            inclusions: [],
            exclusions: []
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !eventDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested event could not be found.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    // This will be implemented later
    alert('Booking functionality will be implemented soon!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Event Image */}
      <section className="relative h-[70vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${eventDetails.images?.[selectedImage] || eventDetails.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=center'})` 
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Event Title Overlay */}
        <div className="relative z-10 flex h-full items-end">
          <div className="w-full max-w-7xl mx-auto px-6 pb-12">
            <div className="max-w-4xl">
              <div className={`inline-block px-4 py-2 rounded-full text-white font-semibold text-sm mb-4 ${
                type === 'event' ? 'bg-blue-600/90' : 'bg-purple-600/90'
              }`}>
                {type?.charAt(0).toUpperCase()}{type?.slice(1)}
              </div>
              
              <h1 
                className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
              >
                {eventDetails.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span className="text-lg">{eventDetails.address}</span>
                </div>
                {eventDetails.date && (
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span className="text-lg">{eventDetails.date}</span>
                  </div>
                )}
                {eventDetails.time && (
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span className="text-lg">{eventDetails.time}</span>
                  </div>
                )}
              </div>
              
              {eventDetails.rating && (
                <div className="flex items-center gap-2 text-white/90 mb-6">
                  <Star size={18} fill="currentColor" className="text-yellow-400" />
                  <span className="text-lg font-semibold">{eventDetails.rating}</span>
                  {eventDetails.reviews && (
                    <span className="text-lg">({eventDetails.reviews} reviews)</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Action Bar */}
      <section className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isWishlisted 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                <span className="font-medium">{isWishlisted ? 'Saved' : 'Save'}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                <Share2 size={18} />
                <span className="font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Additional Image Gallery */}
            {eventDetails.images && eventDetails.images.length > 1 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">More Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {eventDetails.images.slice(1, 7).map((img, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setSelectedImage(index + 1)}
                      className="relative aspect-video rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
                    >
                      <img src={img} alt={`View ${index + 2}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Event Details */}
            <div className="mb-8">
              {eventDetails.capacity && (
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <Users size={20} />
                  <span className="text-lg">Maximum {eventDetails.capacity} guests</span>
                </div>
              )}

              {/* Description */}
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">About this {type}</h2>
                <p className="text-gray-700 leading-relaxed">{eventDetails.description}</p>
              </div>
            </div>

            {/* Highlights */}
            {eventDetails.highlights && eventDetails.highlights.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {eventDetails.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-8">
              {eventDetails.inclusions && eventDetails.inclusions.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-green-700">What's Included</h2>
                  <ul className="space-y-2">
                    {eventDetails.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-500 font-bold">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {eventDetails.exclusions && eventDetails.exclusions.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-red-700">Not Included</h2>
                  <ul className="space-y-2">
                    {eventDetails.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-500 font-bold">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-28 border border-gray-100">
              <div className="mb-8">
                <div className="text-center mb-4">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-blue-600">
                      {typeof eventDetails.price === 'string' ? eventDetails.price : `₹${eventDetails.price}`}
                    </span>
                    <span className="text-gray-600 text-lg">per person</span>
                  </div>
                  {eventDetails.organizer && (
                    <p className="text-sm text-gray-600">Hosted by <span className="font-medium">{eventDetails.organizer}</span></p>
                  )}
                </div>
              </div>

              {/* Guest Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Number of Guests
                </label>
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-6 py-4">
                  <span className="font-medium text-gray-700">Adults</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors font-bold text-lg"
                      disabled={guests <= 1}
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-xl">{guests}</span>
                    <button
                      onClick={() => setGuests(Math.min(eventDetails.capacity || 10, guests + 1))}
                      className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors font-bold text-lg"
                      disabled={eventDetails.capacity ? guests >= eventDetails.capacity : false}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-100 pt-6 mb-8">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-blue-600">
                    {typeof eventDetails.price === 'string' 
                      ? eventDetails.price 
                      : `₹${(eventDetails.price as number * guests).toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Book Now
              </button>

              <p className="text-sm text-gray-500 text-center mt-4 font-medium">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
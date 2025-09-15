import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Calendar, MapPin, Clock, Camera, User } from 'phosphor-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { NearbyApiService, DetailedEvent, DetailedExperience } from '../services/nearby-api';
import { BookingApiService } from '../services/booking-api';
import { ZeptoMailService } from '../services/zepto-mail';
import { supabase } from '../lib/supabase';
import LoginModal from '../components/LoginModal';

interface EventDetails {
  // Common fields
  id: string;
  event_name: string;
  description: string;
  primary_category: string;

  // Event-specific fields
  tagline?: string;
  short_description?: string;
  long_description?: string;
  date?: string;
  start_time?: string;
  duration?: number;
  address_city: string;
  address_venue: string;
  address_landmark?: string;
  address_full_address: string;
  address_google_map_link?: string;
  fixed_price?: number;
  pricing_type?: string;
  banner_image?: string;
  contact_name?: string;
  contact_number?: string;

  // Experience-specific fields
  sub_category?: string;
  ticket_price?: number;
  time_slots?: Array<{start: string; end: string}>;
  experience_photo_urls?: string[];
  emergency_contact_number?: string;

  // Registration flow fields
  is_screening_allowed?: boolean;
  custom_form?: Record<string, string>;

  // Content fields
  guidelines?: string;
  faqs?: Record<string, string>;

  // Formatted fields for display
  formattedPrice?: string;
  formattedDate?: string;
  formattedTime?: string;
  mainImage?: string;
  allImages?: string[];
}

const BookingPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [guests, setGuests] = useState(1);
  const { addItemToWishlist, removeItemFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  // Registration flow states
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [customFormData, setCustomFormData] = useState<Record<string, string>>({});
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Booking status states
  const [bookingStatus, setBookingStatus] = useState<'register' | 'registered' | 'approved' | 'rejected'>('register');
  const [bookingStatusLoading, setBookingStatusLoading] = useState(false);

  // Login modal state
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Long description expansion state
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Email testing state
  //const [setEmailTestLoading] = useState(false);

  const isWishlisted = eventDetails && id && type ? isInWishlist(id, type as 'event' | 'experience') : false;

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showRegistrationModal) {
        setShowRegistrationModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showRegistrationModal]);

  const handleWishlistToggle = async () => {
    if (!eventDetails || !id || !type || !user) {
      // Show login modal
      setShowLoginModal(true);
      return;
    }

    try {
      if (isWishlisted) {
        await removeItemFromWishlist(id, type as 'event' | 'experience');
      } else {
        await addItemToWishlist({
          item_type: type as 'event' | 'experience',
          item_id: id,
          item_name: eventDetails.event_name,
          item_image_url: eventDetails.mainImage,
          item_location: eventDetails.address_city
        });
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      alert('Failed to update wishlist. Please try again.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: eventDetails?.event_name || 'Check out this event',
      text: eventDetails?.description || eventDetails?.short_description || 'Amazing event you should check out!',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      // If all else fails, try to copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        // Final fallback
        alert('Unable to share. Please copy the link manually from your browser address bar.');
      }
    }
  };

  const handleRegistrationClick = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Pre-fill personal details if available
    setPersonalDetails({
      name: user.user_metadata?.full_name || '',
      email: user.email || '',
      phone: user.user_metadata?.phone || ''
    });

    setShowRegistrationModal(true);
  };

  const handleCustomFormChange = (question: string, answer: string) => {
    setCustomFormData(prev => ({
      ...prev,
      [question]: answer
    }));
  };

  const handlePersonalDetailsChange = (field: string, value: string) => {
    setPersonalDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateRegistrationForm = (): boolean => {
    // Check custom form fields
    if (eventDetails?.custom_form) {
      for (const question of Object.keys(eventDetails.custom_form)) {
        if (!customFormData[question]?.trim()) {
          alert(`Please answer: ${question}`);
          return false;
        }
      }
    }

    // Check personal details
    if (!personalDetails.name.trim()) {
      alert('Please enter your name');
      return false;
    }
    if (!personalDetails.email.trim()) {
      alert('Please enter your email');
      return false;
    }
    if (!personalDetails.phone.trim()) {
      alert('Please enter your phone number');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(personalDetails.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Check booking status for screening events
  const checkBookingStatus = async () => {
    console.log('🔄 checkBookingStatus called:', {
      hasUser: !!user,
      eventId: id,
      isScreeningAllowed: eventDetails?.is_screening_allowed,
      shouldProceed: !!(user && id && eventDetails?.is_screening_allowed)
    });

    if (!user || !id || !eventDetails?.is_screening_allowed) {
      console.log('⏭️ Skipping booking status check - missing requirements');
      return;
    }

    setBookingStatusLoading(true);
    try {
      const response = await BookingApiService.checkBookingStatus(id);
      const status = BookingApiService.getBookingState(response);

      console.log('📝 Setting booking status:', status);
      setBookingStatus(status);
    } catch (error) {
      console.error('Error checking booking status:', error);
      // Keep default state on error
    } finally {
      setBookingStatusLoading(false);
    }
  };

  const handleRegistrationSubmit = async () => {
    if (!validateRegistrationForm()) return;

    setRegistrationLoading(true);
    try {
      // Get the auth token from Supabase
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('No auth token found. Please login again.');
      }

      // Convert custom form questions to snake_case for API
      const customFormDataSnakeCase: Record<string, string> = {};
      Object.entries(customFormData).forEach(([question, answer]) => {
        const snakeCaseKey = question.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
        customFormDataSnakeCase[snakeCaseKey] = answer;
      });

      // Prepare API payload
      const payload = {
        event_id: id,
        name: personalDetails.name,
        phone_number: personalDetails.phone,
        email: personalDetails.email,
        custom_form_data: customFormDataSnakeCase
      };

      // Get base URL from environment
      const baseUrl = import.meta.env.VITE_VASTUSETU_API_BASE_URL || 'https://www.vastusetu.com';

      // Make API call
      const response = await fetch(`${baseUrl}/api/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to submit registration');
      }

      const result = await response.json();
      console.log('Registration successful:', result);

      // Send confirmation email via ZeptoMail
      try {
        console.log('📧 Sending registration confirmation email with all fields...');
        // Format date for email
        const eventDate = eventDetails?.date
          ? new Date(eventDetails.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : 'Date to be announced';

        // Format full address for email
        const eventAddress = [
          eventDetails?.address_venue,
          eventDetails?.address_city,
          eventDetails?.address_landmark,
          eventDetails?.address_full_address
        ].filter(Boolean).join(', ') || 'Address to be announced';

        const emailResult = await ZeptoMailService.sendRegistrationEmail({
          eventName: eventDetails?.event_name || 'Event Registration',
          customerName: personalDetails.name,
          customerEmail: personalDetails.email,
          eventDate,
          eventAddress,
        });

        if (emailResult.success) {
          console.log('✅ Registration confirmation email sent successfully');
        } else {
          console.warn('⚠️ Email sending failed, but registration was successful:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Error sending confirmation email (registration still successful):', emailError);
      }

      setBookingStatus('registered');
      setShowRegistrationModal(false);

      // Reset form data
      setCustomFormData({});
      setPersonalDetails({ name: '', email: '', phone: '' });

    } catch (error) {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setRegistrationLoading(false);
    }
  };

  // Test email function (for development/testing)
  // const handleTestEmail = async () => {
  //   setEmailTestLoading(true);
  //   try {
  //     const result = await ZeptoMailService.sendTestEmail();
  //     if (result.success) {
  //       alert('✅ Test email sent successfully! Check rajvaidhyag@gmail.com');
  //     } else {
  //       alert(`❌ Test email failed: ${result.error}`);
  //     }
  //   } catch (error) {
  //     alert(`❌ Test email error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  //   } finally {
  //     setEmailTestLoading(false);
  //   }
  // };

  // Format date to human readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Kolkata'
      });
    } catch {
      return dateString;
    }
  };

  // Format time to 12-hour format - no timezone conversion
  const formatTime = (timeString: string) => {
    try {
      // Check if it's a timestamp or time string
      if (timeString.includes('T') || timeString.includes('-')) {
        // It's a timestamp like "2025-09-25T16:00:00Z", extract time part only
        const date = new Date(timeString);
        // Get UTC time components without timezone conversion
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();

        // Create a new date with just the time components
        const timeOnlyDate = new Date();
        timeOnlyDate.setHours(hours, minutes, 0, 0);

        return timeOnlyDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } else {
        // It's a time string like "14:30"
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
    } catch {
      return timeString;
    }
  };

  // Fetch real event data from API
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!type || !id) {
        setError('Missing event type or ID');
        setLoading(false);
        return;
      }

      // AGGRESSIVE DEBUGGING FOR VERCEL - removed unused debugData

      // Removed aggressive alert debugging

      try {
        setLoading(true);
        setError(null);

        // Debug info removed

        let apiData;
        if (type === 'event') {
          apiData = await NearbyApiService.getEventDetails(id) as DetailedEvent;
        } else if (type === 'experience') {
          apiData = await NearbyApiService.getExperienceDetails(id) as DetailedExperience;
        } else {
          throw new Error('Invalid event type');
        }

        // Debug info removed

        // Transform API data to EventDetails format
        const transformedData: EventDetails = {
          id: apiData.id,
          event_name: apiData.event_name,
          description: 'description' in apiData ? apiData.description : apiData.short_description || '',
          primary_category: apiData.primary_category,

          // Event-specific fields
          tagline: 'tagline' in apiData ? apiData.tagline : undefined,
          short_description: 'short_description' in apiData ? apiData.short_description : undefined,
          long_description: 'long_description' in apiData ? apiData.long_description : undefined,
          date: 'date' in apiData ? apiData.date : undefined,
          start_time: 'start_time' in apiData ? apiData.start_time : undefined,
          duration: 'duration' in apiData ? apiData.duration : undefined,
          address_city: apiData.address_city,
          address_venue: apiData.address_venue,
          address_landmark: 'address_landmark' in apiData ? apiData.address_landmark : undefined,
          address_full_address: apiData.address_full_address,
          address_google_map_link: (apiData as any).address_google_map_link,
          fixed_price: 'fixed_price' in apiData ? apiData.fixed_price : undefined,
          pricing_type: 'pricing_type' in apiData ? apiData.pricing_type : undefined,
          banner_image: 'banner_image' in apiData ? apiData.banner_image : undefined,
          contact_name: 'contact_name' in apiData ? apiData.contact_name : undefined,
          contact_number: 'contact_number' in apiData ? apiData.contact_number : undefined,

          // Experience-specific fields
          sub_category: 'sub_category' in apiData ? apiData.sub_category : undefined,
          ticket_price: 'ticket_price' in apiData ? apiData.ticket_price : undefined,
          time_slots: 'time_slots' in apiData ? apiData.time_slots : undefined,
          experience_photo_urls: 'experience_photo_urls' in apiData ? apiData.experience_photo_urls : undefined,
          emergency_contact_number: 'emergency_contact_number' in apiData ? apiData.emergency_contact_number : undefined,

          // Registration flow fields
          is_screening_allowed: (apiData as any).is_screening_allowed,
          custom_form: (apiData as any).custom_form,

          // Content fields
          guidelines: (apiData as any).guidelines,
          faqs: (apiData as any).faqs,

          // Formatted fields for display
          formattedPrice: type === 'event' && 'fixed_price' in apiData
            ? `₹${apiData.fixed_price.toLocaleString()}`
            : type === 'experience' && 'ticket_price' in apiData
              ? `₹${apiData.ticket_price.toLocaleString()}`
              : 'Price not available',
          formattedDate: 'date' in apiData ? formatDate(apiData.date) : undefined,
          formattedTime: 'start_time' in apiData ? formatTime(apiData.start_time) : undefined,
          mainImage: 'banner_image' in apiData ? apiData.banner_image : 'experience_photo_urls' in apiData && apiData.experience_photo_urls.length > 0 ? apiData.experience_photo_urls[0] : '/api/placeholder/800/600',
          allImages: 'experience_photo_urls' in apiData && apiData.experience_photo_urls.length > 0
            ? apiData.experience_photo_urls
            : 'banner_image' in apiData && apiData.banner_image
              ? [apiData.banner_image]
              : ['/api/placeholder/800/600']
        };

        setEventDetails(transformedData);
      } catch (err) {
        console.error('Error fetching event details:', err);

        // Debug info removed

        setError(err instanceof Error ? err.message : 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [type, id]);

  // Check booking status when user logs in or event details are loaded
  useEffect(() => {
    console.log('🎣 useEffect triggered for booking status check:', {
      hasEventDetails: !!eventDetails,
      hasUser: !!user,
      isScreeningAllowed: eventDetails?.is_screening_allowed,
      eventName: eventDetails?.event_name
    });

    if (eventDetails && user && eventDetails.is_screening_allowed) {
      checkBookingStatus();
    }

    // Reset booking status when user logs out
    if (!user) {
      setBookingStatus('register');
    }
  }, [eventDetails, user]);

  // Handle auth state changes (login/signup success)
  useEffect(() => {
    console.log('🔐 Auth state changed:', { hasUser: !!user, userEmail: user?.email });

    // When user successfully logs in/signs up, close login modal
    if (user && showLoginModal) {
      console.log('✅ User logged in, closing login modal');
      setShowLoginModal(false);
    }
  }, [user, showLoginModal]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-xl font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !eventDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || 'Event not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-0">
        <div className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] relative overflow-hidden">
          <img
            src={eventDetails.allImages?.[selectedImage] || eventDetails.mainImage}
            alt={eventDetails.event_name}
            className="w-full h-full object-cover"
          />

          {/* Black overlay with content */}
          <div className="absolute inset-0 bg-black/50 flex items-center md:items-end justify-center pb-4 md:pb-8 lg:pb-12">
            <div className="text-center text-white max-w-4xl mx-auto px-4 md:px-6">
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                {eventDetails.event_name}
              </h1>
              {eventDetails.tagline && (
                <p className="text-base md:text-xl lg:text-xl font-light mb-4 md:mb-6 opacity-90 drop-shadow-md">
                  {eventDetails.tagline}
                </p>
              )}
              <div className="hidden md:flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm md:text-lg">
                <div className="flex items-center gap-2">
                  <MapPin size={20} weight="duotone" />
                  <span>{eventDetails.address_city}</span>
                </div>
                {eventDetails.formattedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar size={20} weight="duotone" />
                    <span>{eventDetails.formattedDate}</span>
                  </div>
                )}
                {eventDetails.formattedTime && (
                  <div className="flex items-center gap-2">
                    <Clock size={20} weight="duotone" />
                    <span>{eventDetails.formattedTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Image selection buttons */}
        {eventDetails.allImages && eventDetails.allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {eventDetails.allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  selectedImage === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Action Buttons */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleWishlistToggle}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors border-2 ${
              isWishlisted
                ? 'bg-red-100 text-red-600 border-red-300'
                : 'text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400'
            }`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
            <span className="sm:hidden">{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
          </button>
          <button
            onClick={handleShare}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Left Content */}
          <div className="lg:col-span-2 space-y-12 min-w-0">

            {/* Image Gallery */}
            {eventDetails.allImages && eventDetails.allImages.length > 1 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                  <Camera size={32} weight="duotone" className="text-gray-600" />
                  <h2 className="text-3xl font-bold text-black">Gallery</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {eventDetails.allImages.slice(1, 7).map((img, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setSelectedImage(index + 1)}
                      className="aspect-video rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <img src={img} alt={`View ${index + 2}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* About Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-3xl font-bold text-black">About</h2>
              </div>
              <div className="max-w-none">
                {eventDetails.short_description && (
                  <p className="text-base text-gray-700 mb-6 leading-relaxed break-words">
                    {eventDetails.short_description}
                  </p>
                )}
                {eventDetails.long_description && (
                  <div className="text-base text-gray-700 leading-relaxed space-y-4">
                    {isDescriptionExpanded ? (
                      <>
                        {eventDetails.long_description.split('\n').map((paragraph, index) => (
                          <p key={index} className="break-words">{paragraph}</p>
                        ))}
                        <button
                          onClick={() => setIsDescriptionExpanded(false)}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm mt-4 px-4 py-2 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                        >
                          Show Less
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="break-words">
                          {eventDetails.long_description.length > 200
                            ? `${eventDetails.long_description.substring(0, 200)}...`
                            : eventDetails.long_description}
                        </p>
                        {eventDetails.long_description.length > 200 && (
                          <button
                            onClick={() => setIsDescriptionExpanded(true)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm mt-4 px-4 py-2 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                          >
                            Show More
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-black mb-8 pb-4 border-b border-gray-100">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventDetails.formattedDate && (
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="font-semibold text-black mb-2 text-sm uppercase tracking-wide text-gray-500">Date</h3>
                    <p className="text-gray-900 font-medium break-words">{eventDetails.formattedDate}</p>
                  </div>
                )}
                {eventDetails.formattedTime && (
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="font-semibold text-black mb-2 text-sm uppercase tracking-wide text-gray-500">Time</h3>
                    <p className="text-gray-900 font-medium">{eventDetails.formattedTime}</p>
                  </div>
                )}
                {eventDetails.duration && (
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="font-semibold text-black mb-2 text-sm uppercase tracking-wide text-gray-500">Duration</h3>
                    <p className="text-gray-900 font-medium">{eventDetails.duration} hours</p>
                  </div>
                )}
                {((type === 'event' && eventDetails.contact_number) || (type === 'experience' && eventDetails.emergency_contact_number)) && (
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="font-semibold text-black mb-2 text-sm uppercase tracking-wide text-gray-500">
                      {type === 'event' ? 'Contact Number' : 'Emergency Contact'}
                    </h3>
                    <p className="text-gray-900 font-medium break-words">
                      {type === 'event' ? eventDetails.contact_number : eventDetails.emergency_contact_number}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-black mb-8 pb-4 border-b border-gray-100">Location</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-black mb-6 text-xl">Venue Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Venue</span>
                      <p className="text-gray-900 font-medium mt-2 break-words">{eventDetails.address_venue}</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">City</span>
                      <p className="text-gray-900 font-medium mt-2 break-words">{eventDetails.address_city}</p>
                    </div>
                    {eventDetails.address_landmark && (
                      <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 md:col-span-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Landmark</span>
                        <p className="text-gray-900 font-medium mt-2 break-words">{eventDetails.address_landmark}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-6 text-xl">Full Address</h3>
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-gray-700 leading-relaxed break-words">{eventDetails.address_full_address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Slots for Experiences */}
            {type === 'experience' && eventDetails.time_slots && eventDetails.time_slots.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-3xl font-bold text-black mb-8 pb-4 border-b border-gray-100">Available Times</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventDetails.time_slots.map((slot, index) => (
                    <div key={index} className="p-6 text-center bg-gray-50 rounded-xl border border-gray-100">
                      <Clock size={24} weight="duotone" className="mx-auto mb-3 text-gray-600" />
                      <p className="font-semibold text-black">{formatTime(slot.start)} - {formatTime(slot.end)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar - Booking */}
          <div className="lg:col-span-1 order-first lg:order-last min-w-0">
            <div id="booking-section" className="sticky top-4 lg:top-6 bg-blue-600 border border-blue-700 rounded-xl p-4 lg:p-6 max-w-full shadow-lg">

              {/* Pricing - Only show for approved bookings or non-screening events */}
              {(bookingStatus === 'approved' || !eventDetails?.is_screening_allowed) && (
                <div className="bg-white rounded-xl p-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-black mb-1 break-words">
                      {eventDetails.formattedPrice}
                    </div>
                    <div className="text-gray-600 text-sm">per person</div>
                    {eventDetails.pricing_type && (
                      <div className="mt-2 inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {eventDetails.pricing_type}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div className="bg-white rounded-xl p-4 mb-6">
                <div className="space-y-3">
                  {eventDetails.formattedDate && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                      <Calendar size={16} weight="duotone" className="text-gray-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-gray-500">Date</div>
                        <div className="text-black font-medium text-sm truncate">{eventDetails.formattedDate}</div>
                      </div>
                    </div>
                  )}
                  {eventDetails.formattedTime && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                      <Clock size={16} weight="duotone" className="text-gray-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-gray-500">Start Time</div>
                        <div className="text-black font-medium text-sm">{eventDetails.formattedTime}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50">
                    <MapPin size={16} weight="duotone" className="text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-gray-500">Location</div>
                      {eventDetails.address_google_map_link ? (
                        <button
                          onClick={() => window.open(eventDetails.address_google_map_link!, '_blank')}
                          className="text-blue-600 font-medium text-sm text-left hover:text-blue-800 transition-colors break-words"
                        >
                          {eventDetails.address_full_address}
                        </button>
                      ) : (
                        <div className="text-blue-600 font-medium text-sm break-words">
                          {eventDetails.address_full_address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Selection - Only show for approved bookings or non-screening events */}
              {(bookingStatus === 'approved' || !eventDetails?.is_screening_allowed) && (
                <div className="bg-white rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-black">Guests</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                        disabled={guests <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{guests}</span>
                      <button
                        onClick={() => setGuests(guests + 1)}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Total Price - Only show for approved bookings or non-screening events */}
              {(bookingStatus === 'approved' || !eventDetails?.is_screening_allowed) && (
                <div className="bg-white rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center text-xl font-bold text-black">
                    <span>Total</span>
                    <span>
                      {type === 'event'
                        ? eventDetails.fixed_price
                          ? `₹${(eventDetails.fixed_price * guests).toLocaleString()}`
                          : eventDetails.formattedPrice
                        : eventDetails.ticket_price
                        ? `₹${(eventDetails.ticket_price * guests).toLocaleString()}`
                        : eventDetails.formattedPrice}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 text-right mt-1">
                    for {guests} guest{guests > 1 ? 's' : ''}
                  </div>
                </div>
              )}

              {/* Registration Success Messages */}
              {bookingStatus === 'registered' && (
                <div className="bg-white rounded-xl p-4 mb-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎉</div>
                      <h3 className="font-bold text-green-800 mb-1">You have successfully registered</h3>
                      <p className="text-green-700 text-sm">Please check your email for further details.</p>
                    </div>
                  </div>
                </div>
              )}

              {bookingStatus === 'approved' && (
                <div className="bg-white rounded-xl p-4 mb-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <h3 className="font-bold text-blue-800 mb-1">Congratulations!</h3>
                      <p className="text-blue-700 text-sm">You have been approved for this event.</p>
                    </div>
                  </div>
                </div>
              )}

              {bookingStatus === 'rejected' && (
                <div className="bg-white rounded-xl p-4 mb-6">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="text-center">
                      <div className="text-2xl mb-2">❌</div>
                      <h3 className="font-bold text-red-800 mb-1">Not Selected</h3>
                      <p className="text-red-700 text-sm">Unfortunately, you were not selected for this event.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Book/Register/Pay Button */}
              {bookingStatusLoading ? (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-4 rounded-xl font-semibold text-lg mb-4 flex items-center justify-center"
                >
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </button>
              ) : bookingStatus === 'register' ? (
                <button
                  onClick={eventDetails?.is_screening_allowed === true ? handleRegistrationClick : () => alert('Booking functionality will be implemented soon!')}
                  className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors mb-4"
                >
                  {eventDetails?.is_screening_allowed === true ? 'Register Now' : 'Book Now'}
                </button>
              ) : bookingStatus === 'approved' ? (
                <button
                  onClick={() => alert('Payment functionality will be implemented soon!')}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors mb-4"
                >
                  Pay Now
                </button>
              ) : bookingStatus === 'rejected' ? null : null}

              {bookingStatus !== 'approved' && bookingStatus !== 'rejected' && (
                <div className="bg-white rounded-xl p-4 mb-6">
                  <p className="text-center text-sm text-gray-500">
                    You won't be charged yet
                  </p>
                </div>
              )}

              {/* Organizer Info */}
              {eventDetails.contact_name && (
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} weight="duotone" className="text-gray-500" />
                    <div className="text-sm text-gray-500">Organized by</div>
                  </div>
                  <div className="font-medium text-black">{eventDetails.contact_name}</div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Guidelines and FAQs Section */}
      {(eventDetails.guidelines && eventDetails.guidelines.trim()) || (eventDetails.faqs && Object.keys(eventDetails.faqs).length > 0) ? (
        <section className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Guidelines */}
            {eventDetails.guidelines && eventDetails.guidelines.trim() && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-black mb-4">Guidelines</h3>
                <div className="space-y-3 text-gray-700 text-sm whitespace-pre-line">
                  {eventDetails.guidelines}
                </div>
              </div>
            )}

            {/* FAQs */}
            {eventDetails.faqs && Object.keys(eventDetails.faqs).length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-black mb-4">FAQs</h3>
                <div className="space-y-4 text-sm">
                  {Object.entries(eventDetails.faqs).map(([question, answer], index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-black mb-1">{question}</h4>
                      <p className="text-gray-700 whitespace-pre-line">{answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      ) : null}

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-gradient-to-r from-black/60 to-gray-800/60 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col bg-white">
            {/* Modal Header */}
            <div className="flex-shrink-0 border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-xl sm:rounded-t-2xl bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-2xl font-bold text-black">Register for Event</h2>
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <span className="text-2xl text-gray-500">×</span>
                </button>
              </div>
              <p className="text-gray-600 mt-2 text-sm break-words pr-8">{eventDetails?.event_name}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Custom Form Section */}
              {eventDetails?.custom_form && Object.keys(eventDetails.custom_form).length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">Custom Form</h3>
                  <div className="space-y-4">
                    {Object.entries(eventDetails.custom_form).map(([question, hint], index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {question.charAt(0).toUpperCase() + question.slice(1).replace(/_/g, ' ')}
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        {hint && (
                          <p className="text-xs text-gray-500 mb-2">{hint}</p>
                        )}
                        <textarea
                          value={customFormData[question] || ''}
                          onChange={(e) => handleCustomFormChange(question, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder={`Enter your answer for: ${question.replace(/_/g, ' ')}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Details Section */}
              <div>
                <h3 className="text-xl font-semibold text-black mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalDetails.name}
                      onChange={(e) => handlePersonalDetailsChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={personalDetails.email}
                      onChange={(e) => handlePersonalDetailsChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={personalDetails.phone}
                      onChange={(e) => handlePersonalDetailsChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 px-4 sm:px-6 py-4 rounded-b-xl sm:rounded-b-2xl bg-white">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegistrationSubmit}
                  disabled={registrationLoading}
                  className="flex-1 px-4 sm:px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center text-sm sm:text-base"
                >
                  {registrationLoading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Removed debug panels that might cause Vercel 400 error */}

    </div>
  );
};

export default BookingPage;
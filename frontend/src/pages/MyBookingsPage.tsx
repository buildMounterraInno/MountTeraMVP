import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BookingApiService, Booking } from '../services/booking-api';
import { NearbyApiService } from '../services/nearby-api';

interface BookingWithEventDetails extends Booking {
  eventDetails?: {
    event_name: string;
    tagline?: string;
    short_description?: string;
    date?: string;
    start_time?: string;
    address_city: string;
    address_venue: string;
    banner_image?: string;
    experience_photo_urls?: string[];
    fixed_price?: number;
    ticket_price?: number;
    primary_category: string;
  };
  eventType?: 'event' | 'experience';
  loadingDetails?: boolean;
  detailsError?: string;
}

const MyBookingsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingWithEventDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to home if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/" replace />;
  }

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await BookingApiService.getAllBookings();

        if (response.success && response.data) {
          // Convert bookings and start fetching event details
          const bookingsWithDetails: BookingWithEventDetails[] = response.data.map(booking => ({
            ...booking,
            loadingDetails: true
          }));

          setBookings(bookingsWithDetails);

          // Fetch event details for each booking
          const updatedBookings = await Promise.allSettled(
            bookingsWithDetails.map(async (booking) => {
              try {
                // Try to fetch as event first
                let eventDetails;
                let eventType: 'event' | 'experience' = 'event';

                try {
                  eventDetails = await NearbyApiService.getEventDetails(booking.event_id);
                } catch (eventError) {
                  // If event fetch fails, try as experience
                  try {
                    eventDetails = await NearbyApiService.getExperienceDetails(booking.event_id);
                    eventType = 'experience';
                  } catch (experienceError) {
                    throw new Error('Could not fetch event details');
                  }
                }

                return {
                  ...booking,
                  eventDetails,
                  eventType,
                  loadingDetails: false
                };
              } catch (error) {
                return {
                  ...booking,
                  loadingDetails: false,
                  detailsError: error instanceof Error ? error.message : 'Failed to load event details'
                };
              }
            })
          );

          // Update bookings with results
          const finalBookings = updatedBookings.map((result, index) => {
            if (result.status === 'fulfilled') {
              return result.value;
            } else {
              return {
                ...bookingsWithDetails[index],
                loadingDetails: false,
                detailsError: 'Failed to load event details'
              };
            }
          });

          setBookings(finalBookings);
        } else {
          setError(response.error || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const getStatusBadge = (isApproved: boolean | null) => {
    if (isApproved === null) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle size={12} />
          Pending Review
        </span>
      );
    }

    if (isApproved === true) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} />
          Approved
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle size={12} />
        Rejected
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pt-24">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Bookings</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Track and manage your event registrations</p>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500 mb-6">You haven't registered for any events or experiences yet.</p>
            {/* <Link
              to="/"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Explore Events
            </Link> */}
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Event Image */}
                    <div className="flex-shrink-0">
                      {booking.loadingDetails ? (
                        <div className="w-full lg:w-48 h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                      ) : booking.eventDetails?.banner_image || booking.eventDetails?.experience_photo_urls?.[0] ? (
                        <img
                          src={booking.eventDetails.banner_image || booking.eventDetails.experience_photo_urls?.[0]}
                          alt={booking.eventDetails.event_name}
                          className="w-full lg:w-48 h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                        <div className="min-w-0 flex-1">
                          {booking.loadingDetails ? (
                            <div className="space-y-2">
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                            </div>
                          ) : booking.detailsError ? (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">Event #{booking.event_id}</h3>
                              <p className="text-sm text-red-600">{booking.detailsError}</p>
                            </div>
                          ) : (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                {booking.eventDetails?.event_name || 'Unknown Event'}
                              </h3>
                              {booking.eventDetails?.tagline && (
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                  {booking.eventDetails.tagline}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex-shrink-0">
                          <div className="text-right">
                            {getStatusBadge(booking.is_approved)}
                            {booking.is_approved === true && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-green-700 mb-1">🎉 You're selected!</p>
                                <p className="text-xs text-gray-600 max-w-48 lg:max-w-none">
                                  View details to complete payment process
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Event Meta Information */}
                      {!booking.loadingDetails && booking.eventDetails && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-4">
                          {booking.eventDetails.date && (
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              <span>{formatDate(booking.eventDetails.date)}</span>
                            </div>
                          )}
                          {booking.eventDetails.start_time && (
                            <div className="flex items-center gap-2">
                              <Clock size={14} />
                              <span>{formatTime(booking.eventDetails.start_time)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span className="truncate">{booking.eventDetails.address_city}</span>
                          </div>
                        </div>
                      )}

                      {/* Registration Details */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <User size={14} />
                        <span>Registered as: {booking.name}</span>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end">
                        {!booking.loadingDetails && !booking.detailsError && (
                          <Link
                            to={`/booking/${booking.eventType}/${booking.event_id}`}
                            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
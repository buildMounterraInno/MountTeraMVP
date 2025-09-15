interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface NearbyEventsRequest {
  lat: string;
  lng: string;
  max_distance: string;
}

interface NearbyExperiencesRequest {
  lat: string;
  lng: string;
  max_distance: string;
}

interface NearbyEventItem {
  id: string;
  latitude: number;
  longitude: number;
  distance_km: number;
}

interface NearbyExperienceItem {
  id: string;
  latitude: number;
  longitude: number;
  distance_km: number;
}

interface NearbyEventsResponse {
  events?: NearbyEventItem[];
  [key: number]: NearbyEventItem;
  length?: number;
}

interface NearbyExperiencesResponse {
  experiences?: NearbyExperienceItem[];
  [key: number]: NearbyExperienceItem;
  length?: number;
}

interface DetailedEvent {
  id: string;
  event_name: string;
  tagline: string;
  primary_category: string;
  short_description: string;
  long_description: string;
  date: string;
  start_time: string;
  duration: number;
  address_city: string;
  address_venue: string;
  address_landmark: string;
  address_full_address: string;
  fixed_price: number;
  pricing_type: string;
  banner_image: string;
  contact_name: string;
  contact_number: string;
}

interface DetailedExperience {
  id: string;
  event_name: string;
  description: string;
  primary_category: string;
  sub_category: string;
  ticket_price: number;
  time_slots: Array<{start: string; end: string}>;
  experience_photo_urls: string[];
  emergency_contact_number: string;
  address_city: string;
  address_venue: string;
  address_full_address: string;
}

interface ErrorResponse {
  error: string;
  message: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://primary-production-b3fe0.up.railway.app';
const VASTUSETU_API_BASE_URL = import.meta.env.VITE_VASTUSETU_API_BASE_URL || 'https://www.vastusetu.com';

export class NearbyApiService {
  private static baseUrl = API_BASE_URL;
  private static vastusetuBaseUrl = VASTUSETU_API_BASE_URL;

  /**
   * Get user's current location using the Geolocation API
   */
  static async getCurrentLocation(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = 'Unable to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timeout';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  }

  /**
   * Get nearby events based on user location
   */
  static async getNearbyEvents(
    coordinates: LocationCoordinates,
    maxDistance: string = '500'
  ): Promise<NearbyEventsResponse> {
    try {
      const requestBody: NearbyEventsRequest = {
        lat: coordinates.lat.toString(),
        lng: coordinates.lng.toString(),
        max_distance: maxDistance,
      };

      const response = await fetch(`${this.baseUrl}/webhook/nearby-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        throw new Error(errorData.message || errorData.error || 'Failed to fetch nearby events');
      }

      // Handle different response formats
      if (Array.isArray(data)) {
        return { events: data } as NearbyEventsResponse;
      } else if (data && data.id) {
        // API returns single object, wrap it in array
        return { events: [data] } as NearbyEventsResponse;
      }
      return { events: [] } as NearbyEventsResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to fetch nearby events');
    }
  }

  /**
   * Get nearby experiences based on user location
   */
  static async getNearbyExperiences(
    coordinates: LocationCoordinates,
    maxDistance: string = '500'
  ): Promise<NearbyExperiencesResponse> {
    try {
      const requestBody: NearbyExperiencesRequest = {
        lat: coordinates.lat.toString(),
        lng: coordinates.lng.toString(),
        max_distance: maxDistance,
      };

      const response = await fetch(`${this.baseUrl}/webhook/nearby-experiences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        throw new Error(errorData.message || errorData.error || 'Failed to fetch nearby experiences');
      }

      // Handle different response formats
      if (Array.isArray(data)) {
        return { experiences: data } as NearbyExperiencesResponse;
      } else if (data && data.id) {
        // API returns single object, wrap it in array
        return { experiences: [data] } as NearbyExperiencesResponse;
      }
      return { experiences: [] } as NearbyExperiencesResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to fetch nearby experiences');
    }
  }

  /**
   * Get detailed event data by ID
   */
  static async getEventDetails(eventId: string): Promise<DetailedEvent> {
    try {
      const apiUrl = `${this.vastusetuBaseUrl}/api/events/getevent/${eventId}`;

      const debugInfo = {
        eventId,
        apiUrl,
        vastusetuBaseUrl: this.vastusetuBaseUrl,
        env: {
          VITE_VASTUSETU_API_BASE_URL: import.meta.env.VITE_VASTUSETU_API_BASE_URL,
          NODE_ENV: import.meta.env.NODE_ENV,
          MODE: import.meta.env.MODE
        }
      };

      console.log('🎯 Fetching event details:', debugInfo);

      // Store debug info globally for inspection
      (window as any).lastEventApiCall = debugInfo;

      // Removed aggressive alert debugging

      // Alert for immediate visibility (remove after debugging)
      if (import.meta.env.MODE === 'production') {
        console.warn('PRODUCTION DEBUG - Event API Call:', JSON.stringify(debugInfo, null, 2));
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      const responseInfo = {
        eventId,
        status: response.status,
        ok: response.ok,
        url: apiUrl,
        data: response.ok ? data : 'Error response'
      };

      console.log('📊 Event details API response:', responseInfo);

      // Store response info globally
      (window as any).lastEventApiResponse = responseInfo;

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        const errorInfo = {
          eventId,
          status: response.status,
          error: errorData.error,
          message: errorData.message,
          fullResponse: data
        };

        console.error('❌ Event details API failed:', errorInfo);

        // Store error info globally
        (window as any).lastEventApiError = errorInfo;

        // Removed aggressive alert debugging

        // Production debugging - show error info
        if (import.meta.env.MODE === 'production') {
          console.warn('PRODUCTION DEBUG - Event API Error:', JSON.stringify(errorInfo, null, 2));
        }

        throw new Error(errorData.message || errorData.error || `Failed to fetch event details (${response.status})`);
      }

      // Handle wrapped response format
      if (data.success && data.data) {
        return data.data as DetailedEvent;
      }
      return data as DetailedEvent;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to fetch event details');
    }
  }

  /**
   * Get detailed experience (recurring event) data by ID
   */
  static async getExperienceDetails(experienceId: string): Promise<DetailedExperience> {
    try {
      const apiUrl = `${this.vastusetuBaseUrl}/api/recurringevents/getrecurringevent/${experienceId}`;

      console.log('🎯 Fetching experience details:', {
        experienceId,
        apiUrl,
        vastusetuBaseUrl: this.vastusetuBaseUrl
      });

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      console.log('📊 Experience details API response:', {
        experienceId,
        status: response.status,
        ok: response.ok,
        url: apiUrl,
        data: response.ok ? data : 'Error response'
      });

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        console.error('❌ Experience details API failed:', {
          experienceId,
          status: response.status,
          error: errorData.error,
          message: errorData.message,
          fullResponse: data
        });
        throw new Error(errorData.message || errorData.error || `Failed to fetch experience details (${response.status})`);
      }

      // Handle wrapped response format
      if (data.success && data.data) {
        return data.data as DetailedExperience;
      }
      return data as DetailedExperience;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to fetch experience details');
    }
  }

  /**
   * Utility method to get both events and experiences for a location
   */
  static async getNearbyEventsAndExperiences(
    coordinates: LocationCoordinates,
    maxDistance: string = '500'
  ): Promise<{
    events: NearbyEventsResponse;
    experiences: NearbyExperiencesResponse;
  }> {
    try {
      const [eventsResponse, experiencesResponse] = await Promise.all([
        this.getNearbyEvents(coordinates, maxDistance),
        this.getNearbyExperiences(coordinates, maxDistance),
      ]);

      return {
        events: eventsResponse,
        experiences: experiencesResponse,
      };
    } catch (error) {
      throw error;
    }
  }
}

// Export types for use in components
export type {
  LocationCoordinates,
  NearbyEventItem,
  NearbyExperienceItem,
  NearbyEventsResponse,
  NearbyExperiencesResponse,
  DetailedEvent,
  DetailedExperience,
  ErrorResponse,
};
import { supabase } from '../lib/supabase';

interface BookingStatusResponse {
  success: boolean;
  data?: {
    id: string;
    event_id: string;
    customer_id: string;
    name: string;
    phone_number: string;
    email: string;
    custom_form_data: Record<string, any>;
    is_approved: boolean | null;
  };
  error?: string;
  message?: string;
}

interface Booking {
  id: string;
  event_id: string;
  customer_id: string;
  name: string;
  phone_number: string;
  email: string;
  custom_form_data: Record<string, any>;
  is_approved: boolean | null;
  created_at: string;
  updated_at: string;
}

interface AllBookingsResponse {
  success: boolean;
  data?: Booking[];
  error?: string;
  message?: string;
}

// Use VASTUSETU API base URL for booking endpoints (same as registration)
const API_BASE_URL = import.meta.env.VITE_VASTUSETU_API_BASE_URL || 'https://www.vastusetu.com';

export class BookingApiService {
  private static baseUrl = API_BASE_URL;

  /**
   * Get JWT token from current Supabase session
   */
  private static async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('User not authenticated');
    }

    return session.access_token;
  }

  /**
   * Check booking status for a screening event
   */
  static async checkBookingStatus(eventId: string): Promise<BookingStatusResponse> {
    try {
      const token = await this.getAuthToken();
      const apiUrl = `${this.baseUrl}/api/bookings/event/customer/${eventId}`;

      console.log('🔍 Checking booking status:', {
        eventId,
        apiUrl,
        baseUrl: this.baseUrl,
        hasToken: !!token
      });

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      console.log('📊 Booking status API response:', {
        status: response.status,
        ok: response.ok,
        data
      });

      if (!response.ok) {
        console.warn('❌ Booking status API failed:', {
          status: response.status,
          error: data.error,
          message: data.message
        });
        return {
          success: false,
          error: data.error || 'Failed to check booking status',
          message: data.message || 'Unknown error occurred'
        };
      }

      return data as BookingStatusResponse;
    } catch (error) {
      console.error('💥 Error checking booking status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get all bookings for the current user
   */
  static async getAllBookings(): Promise<AllBookingsResponse> {
    try {
      const token = await this.getAuthToken();
      const apiUrl = `${this.baseUrl}/api/bookings/allMyEvents`;

      console.log('📋 Fetching all bookings:', {
        apiUrl,
        baseUrl: this.baseUrl,
        hasToken: !!token
      });

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      console.log('📊 All bookings API response:', {
        status: response.status,
        ok: response.ok,
        data
      });

      if (!response.ok) {
        console.warn('❌ All bookings API failed:', {
          status: response.status,
          error: data.error,
          message: data.message
        });
        return {
          success: false,
          error: data.error || 'Failed to fetch bookings',
          message: data.message || 'Unknown error occurred'
        };
      }

      return data as AllBookingsResponse;
    } catch (error) {
      console.error('💥 Error fetching all bookings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Determine booking state based on API response
   */
  static getBookingState(response: BookingStatusResponse): 'register' | 'registered' | 'approved' | 'rejected' {
    console.log('🎯 Determining booking state:', {
      success: response.success,
      hasData: !!response.data,
      isApproved: response.data?.is_approved,
      fullResponse: response
    });

    // If no data or empty response, show register button
    if (!response.success || !response.data) {
      console.log('➡️ State: REGISTER (no data or unsuccessful response)');
      return 'register';
    }

    // If data exists, check is_approved field
    if (response.data.is_approved === null) {
      console.log('➡️ State: REGISTERED (is_approved is null)');
      return 'registered'; // Show "Voila, you're registered" message
    }

    if (response.data.is_approved === true) {
      console.log('➡️ State: APPROVED (is_approved is true)');
      return 'approved'; // Show "Pay Now" button
    }

    if (response.data.is_approved === false) {
      console.log('➡️ State: REJECTED (is_approved is false)');
      return 'rejected'; // Show "Not Selected" message
    }

    // Default fallback
    console.log('➡️ State: REGISTER (default fallback)');
    return 'register';
  }
}

export type { BookingStatusResponse, Booking, AllBookingsResponse };
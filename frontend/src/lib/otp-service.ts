import { supabase } from './supabase';
import { AuthError } from '@supabase/supabase-js';

// Generate a 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in localStorage with expiration (5 minutes)
const storeOTP = (email: string, otp: string): void => {
  const otpData = {
    email,
    otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  };
  localStorage.setItem('otp_data', JSON.stringify(otpData));
  console.log('🟡 [OTP SERVICE] Stored OTP:', otp, 'for email:', email);
};

// Retrieve and validate stored OTP
const validateStoredOTP = (email: string, inputOTP: string): boolean => {
  const storedData = localStorage.getItem('otp_data');
  if (!storedData) {
    console.log('❌ [OTP SERVICE] No stored OTP found');
    return false;
  }

  try {
    const otpData = JSON.parse(storedData);

    // Check expiration
    if (Date.now() > otpData.expires) {
      console.log('❌ [OTP SERVICE] OTP expired');
      localStorage.removeItem('otp_data');
      return false;
    }

    // Check email and OTP match
    if (otpData.email !== email || otpData.otp !== inputOTP) {
      console.log('❌ [OTP SERVICE] OTP mismatch');
      return false;
    }

    console.log('✅ [OTP SERVICE] OTP validated successfully');
    localStorage.removeItem('otp_data'); // Clean up after successful validation
    return true;
  } catch (error) {
    console.error('❌ [OTP SERVICE] Error parsing stored OTP:', error);
    localStorage.removeItem('otp_data');
    return false;
  }
};

// Send OTP via custom email
export const sendCustomOTP = async (email: string): Promise<{ error: AuthError | null }> => {
  try {
    console.log('🔵 [OTP SERVICE] Generating custom OTP for:', email);

    // Generate 6-digit OTP
    const otp = generateOTP();

    // Store OTP locally
    storeOTP(email, otp);

    // For now, we'll use a simple approach - send the OTP via Supabase edge function
    // or create a custom email template

    // Try to send via resetPasswordForEmail but with custom template
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/otp-verify?code=${otp}`
    });

    if (error) {
      console.error('❌ [OTP SERVICE] Failed to send email:', error);
      return { error };
    }

    // Also log the OTP to console for debugging
    console.log('🟡 [OTP SERVICE] Generated OTP:', otp);
    console.log('✅ [OTP SERVICE] Email sent successfully');

    return { error: null };
  } catch (error) {
    console.error('💥 [OTP SERVICE] Exception:', error);
    return { error: error as AuthError };
  }
};

// Verify custom OTP
export const verifyCustomOTP = async (
  email: string,
  inputOTP: string,
  newPassword: string
): Promise<{ error: AuthError | null }> => {
  try {
    console.log('🟡 [OTP SERVICE] Verifying custom OTP...');

    // First validate the stored OTP
    if (!validateStoredOTP(email, inputOTP)) {
      return {
        error: {
          message: 'Invalid or expired OTP code',
          name: 'AuthError',
          status: 400
        } as AuthError
      };
    }

    // If OTP is valid, we need to sign in the user first, then update password
    // Try to sign in with the current password first, or use admin update

    console.log('🟡 [OTP SERVICE] OTP validated, attempting password update...');

    // Get the current user session
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();

    if (getUserError || !user) {
      console.log('🟡 [OTP SERVICE] No active session, need to authenticate user first');

      // Since we don't have the old password, we'll use the resetPasswordForEmail
      // approach but with a different flow
      return {
        error: {
          message: 'Please use the password reset link sent to your email to complete the process',
          name: 'AuthError',
          status: 400
        } as AuthError
      };
    }

    // Update password if user is authenticated
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error('❌ [OTP SERVICE] Password update failed:', updateError);
      return { error: updateError };
    }

    console.log('✅ [OTP SERVICE] Password updated successfully!');
    return { error: null };

  } catch (error) {
    console.error('💥 [OTP SERVICE] Exception during verification:', error);
    return { error: error as AuthError };
  }
};

// Get current stored OTP for debugging
export const getStoredOTP = (): string | null => {
  const storedData = localStorage.getItem('otp_data');
  if (!storedData) return null;

  try {
    const otpData = JSON.parse(storedData);
    return otpData.otp;
  } catch {
    return null;
  }
};
import { supabase } from './supabase';
import { AuthError, User } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Sign up with email and password
export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          portal_type: 'customer', // Always set as customer for this portal
        }
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      return { user: null, error };
    }

    // Debug: Log the complete user object
    console.log('Sign up successful. Full user object:', data.user);
    console.log('User metadata after signup:', data.user?.user_metadata);
    console.log('App metadata after signup:', data.user?.app_metadata);

    // Metadata is working! Just log success
    if (data.user?.user_metadata?.portal_type) {
      console.log('✅ Portal type successfully set:', data.user.user_metadata.portal_type);
    } else {
      console.log('⚠️ Portal type not set during signup, this should not happen');
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign up exception:', error);
    return { user: null, error: error as AuthError };
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      return { user: null, error };
    }

    // Simple authentication - this is the customer portal, so anyone who can log in is a customer
    if (data.user) {
      console.log('User authenticated successfully:', data.user.email);
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign in exception:', error);
    return { user: null, error: error as AuthError };
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<{ error: AuthError | null }> => {
  try {
    // Store the current page URL to return to after authentication
    const currentUrl = window.location.href;
    localStorage.setItem('auth_redirect_url', currentUrl);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          portal_type: 'customer' // Set portal type for Google OAuth
        }
      }
    });

    if (error) {
      console.error('Google sign in error:', error);
      // Clean up stored URL on error
      localStorage.removeItem('auth_redirect_url');
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Google sign in exception:', error);
    // Clean up stored URL on error
    localStorage.removeItem('auth_redirect_url');
    return { error: error as AuthError };
  }
};

// Sign out
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  try {
    // Check if there's a session to sign out from
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession) {
      console.log('No active session to sign out from');
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    
    if (error) {
      // Handle specific auth session missing error
      if (error.message?.includes('Auth session missing') || error.message?.includes('session missing')) {
        console.log('Session already cleared');
        return { error: null };
      }
      console.error('Sign out error:', error);
      return { error };
    }

    return { error: null };
  } catch (error: any) {
    // Handle AuthSessionMissingError specifically
    if (error.message?.includes('Auth session missing') || error.message?.includes('session missing')) {
      console.log('Session already missing');
      return { error: null };
    }
    console.error('Sign out exception:', error);
    return { error: error as AuthError };
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get user error:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Get user exception:', error);
    return null;
  }
};

// Send password reset token/OTP - same as before
export const sendPasswordResetOTP = async (email: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error('Send password reset OTP error:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Send password reset OTP exception:', error);
    return { error: error as AuthError };
  }
};

// Verify OTP and update password
export const verifyOTPAndUpdatePassword = async (
  email: string,
  token: string,
  newPassword: string
): Promise<{ error: AuthError | null }> => {
  try {
    // Verify the password reset token
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery'
    });

    if (verifyError) {
      console.error('Password reset token verification error:', verifyError);
      return { error: verifyError };
    }

    if (!data.user || !data.session) {
      return { error: { message: 'Invalid or expired reset code', name: 'AuthError', status: 400 } as AuthError };
    }

    // Update password after successful token verification
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error('Update password error:', updateError);
      return { error: updateError };
    }

    return { error: null };
  } catch (error) {
    console.error('Verify token and update password exception:', error);
    return { error: error as AuthError };
  }
};

// Check if email exists in the system
export const checkEmailExists = async (_email: string): Promise<{ exists: boolean; error: AuthError | null }> => {
  try {
    // Supabase doesn't provide a direct way to check email existence for security reasons
    // Both non-existent emails and wrong passwords return "Invalid login credentials"
    // So we'll disable this check and handle it in the login flow instead
    return { exists: true, error: null }; // Always assume email exists to avoid false negatives
  } catch (error) {
    console.error('Check email exists exception:', error);
    return { exists: true, error: null }; // Default to assuming email exists
  }
};



// Force update user metadata
export const forceUpdateUserMetadata = async (): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        portal_type: 'customer',
        updated_at: new Date().toISOString()
      }
    });

    if (error) {
      console.error('Force update metadata error:', error);
      return { error };
    }

    console.log('Successfully updated user metadata with portal_type');
    return { error: null };
  } catch (error) {
    console.error('Force update metadata exception:', error);
    return { error: error as AuthError };
  }
};
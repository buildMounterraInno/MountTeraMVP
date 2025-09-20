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

    // Check if user has correct portal type for this portal
    if (data.user) {
      console.log('User metadata:', data.user.user_metadata);
      const userPortalType = data.user.user_metadata?.portal_type;
      console.log('User portal type:', userPortalType);
      
      if (userPortalType === 'customer') {
        // Valid customer user
        console.log('✅ Valid customer user');
      } else if (userPortalType === 'vendor') {
        // Vendor trying to access customer portal
        console.log('🚫 Vendor user detected, signing out');
        await supabase.auth.signOut();
        
        const portalError = new Error('This account is registered for the vendor portal. Please use the vendor login page.') as AuthError;
        portalError.status = 400;
        
        return { user: null, error: portalError };
      } else if (!userPortalType) {
        // User with no portal_type - could be legacy customer or could be from vendor portal
        // Don't auto-convert! Instead, require them to sign up fresh or check another way
        console.log('🚫 User has no portal_type - cannot determine portal access');
        await supabase.auth.signOut();
        
        const portalError = new Error('Your account needs to be set up for this portal. Please sign up again or contact support.') as AuthError;
        portalError.status = 400;
        
        return { user: null, error: portalError };
      } else {
        // Any other portal_type
        console.log('🚫 User has unknown portal_type:', userPortalType);
        await supabase.auth.signOut();
        
        const portalError = new Error('This account is not authorized for this portal.') as AuthError;
        portalError.status = 400;
        
        return { user: null, error: portalError };
      }
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
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Google sign in exception:', error);
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

// Password reset
export const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      console.error('Password reset error:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Password reset exception:', error);
    return { error: error as AuthError };
  }
};

// Update password
export const updatePassword = async (newPassword: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('Update password error:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Update password exception:', error);
    return { error: error as AuthError };
  }
};

// Check if email exists in the system
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; error: AuthError | null }> => {
  try {
    // Use Supabase's resetPasswordForEmail with a dummy redirect to check if email exists
    // This is a safe way to check email existence without exposing user data
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dummy-check`
    });

    if (error) {
      // If the error indicates user not found, email doesn't exist
      if (error.message.toLowerCase().includes('user not found') ||
          error.message.toLowerCase().includes('email not found') ||
          error.message.toLowerCase().includes('invalid email')) {
        return { exists: false, error: null };
      }
      // Other errors (like rate limiting) should be treated as system errors
      return { exists: false, error };
    }

    // If no error, email exists
    return { exists: true, error: null };
  } catch (error) {
    console.error('Check email exists exception:', error);
    return { exists: false, error: error as AuthError };
  }
};

// Helper function to validate portal access
export const validatePortalAccess = (user: any): boolean => {
  const portalType = user?.user_metadata?.portal_type;
  return portalType === 'customer'; // ONLY allow users with explicit customer portal_type
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
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting initial session:', error);
      } else {
        // Check if user has correct portal type
        if (initialSession?.user) {
          const userPortalType = initialSession.user.user_metadata?.portal_type;
          
          if (userPortalType === 'customer') {
            // Valid customer user
            setSession(initialSession);
            setUser(initialSession.user);
          } else if (userPortalType === 'vendor') {
            // Vendor user - sign out
            console.log('Vendor user detected on customer portal, signing out');
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
          } else {
            // No portal type - might be OAuth user, let them through for now
            setSession(initialSession);
            setUser(initialSession.user);
          }
        } else {
          setSession(initialSession);
          setUser(null);
        }
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event, session);
        
        // Check portal type for signed in users
        if (session?.user && event === 'SIGNED_IN') {
          const userPortalType = session.user.user_metadata?.portal_type;
          
          // Only block users with explicit wrong portal type (vendor)
          // Allow users with undefined portal_type (new OAuth users)
          if (userPortalType === 'vendor') {
            console.log('Vendor user detected, signing out. Portal type:', userPortalType);
            await supabase.auth.signOut();
            return; // Exit early, the SIGNED_OUT event will handle state updates
          }
          
          // For OAuth users without portal_type, let AuthCallback handle it
          if (!userPortalType && window.location.pathname === '/auth/callback') {
            console.log('OAuth user without portal_type, letting AuthCallback handle it');
            // Continue and let AuthCallback set the portal_type
          }
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle specific auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in:', session?.user?.email);
            break;
          case 'SIGNED_OUT':
            console.log('User signed out');
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed');
            break;
          case 'USER_UPDATED':
            console.log('User updated');
            break;
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Check if there's a session to sign out from
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.log('No active session to sign out from');
        // Still clear local state in case it's out of sync
        setSession(null);
        setUser(null);
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        // Handle specific auth session missing error
        if (error.message?.includes('Auth session missing') || error.message?.includes('session missing')) {
          console.log('Session already cleared, updating local state');
          setSession(null);
          setUser(null);
          return;
        }
        console.error('Error signing out:', error);
        throw error;
      }
    } catch (error: any) {
      // Handle AuthSessionMissingError specifically
      if (error.message?.includes('Auth session missing') || error.message?.includes('session missing')) {
        console.log('Session already missing, clearing local state');
        setSession(null);
        setUser(null);
        return;
      }
      console.error('Sign out exception:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
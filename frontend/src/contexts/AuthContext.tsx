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
          } else {
            // Wrong portal type or no portal type - sign out
            console.log('User has invalid portal access, signing out. Portal type:', userPortalType);
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
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
          
          if (userPortalType !== 'customer') {
            console.log('User has invalid portal access during sign in, signing out. Portal type:', userPortalType);
            await supabase.auth.signOut();
            return; // Exit early, the SIGNED_OUT event will handle state updates
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
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
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
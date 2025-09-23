import React from 'react';
import { supabase } from '../lib/supabase';

const AuthTest: React.FC = () => {
  const handleGoogleTest = async () => {
    console.log('Testing Google OAuth...');
    console.log('Current origin:', window.location.origin);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            portal_type: 'customer'
          }
        }
      });

      console.log('OAuth result:', { data, error });
    } catch (err) {
      console.error('OAuth error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Google OAuth Test</h1>
        <p className="mb-4">Current URL: {window.location.href}</p>
        <button
          onClick={handleGoogleTest}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Test Google OAuth
        </button>
      </div>
    </div>
  );
};

export default AuthTest;
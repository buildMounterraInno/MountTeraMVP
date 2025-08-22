import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/?error=auth_failed');
          return;
        }

        if (data.session) {
          // Check portal type for OAuth users
          const userPortalType = data.session.user.user_metadata?.portal_type;
          
          if (userPortalType && userPortalType !== 'customer') {
            console.log('OAuth user has wrong portal type, signing out');
            await supabase.auth.signOut();
            navigate('/?error=wrong_portal');
            return;
          }
          
          console.log('User authenticated:', data.session.user);
          navigate('/');
        } else {
          navigate('/?error=no_session');
        }
      } catch (error) {
        console.error('Auth callback exception:', error);
        navigate('/?error=auth_exception');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E63EF] mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
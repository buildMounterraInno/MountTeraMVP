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
          
          // If user doesn't have portal_type (new Google OAuth user), set it to customer
          if (!userPortalType) {
            console.log('New Google OAuth user, setting portal_type to customer');
            const { error: updateError } = await supabase.auth.updateUser({
              data: { 
                portal_type: 'customer',
                updated_at: new Date().toISOString()
              }
            });
            
            if (updateError) {
              console.error('Failed to set portal_type for OAuth user:', updateError);
              await supabase.auth.signOut();
              navigate('/?error=metadata_update_failed');
              return;
            }
            
            console.log('✅ Portal type set to customer for Google OAuth user');
            navigate('/');
            return;
          }
          
          // Block vendor users from customer portal (same as email auth)
          if (userPortalType === 'vendor') {
            console.log('🚫 Vendor user detected via Google OAuth, signing out');
            await supabase.auth.signOut();
            navigate('/?error=vendor_portal_required');
            return;
          }
          
          if (userPortalType !== 'customer') {
            console.log('OAuth user has unknown portal type, signing out');
            await supabase.auth.signOut();
            navigate('/?error=unauthorized_portal');
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
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // First, try to get the session from the URL hash (OAuth callback)
        const { data: authData, error: authError } = await supabase.auth.getSession();

        if (authError) {
          console.error('Auth callback error:', authError);
          navigate('/?error=auth_failed');
          return;
        }

        // If no session, try to get user directly (might be OAuth flow)
        if (!authData.session) {
          const { data: userData, error: userError } = await supabase.auth.getUser();

          if (userError || !userData.user) {
            console.error('No session or user found:', userError);
            navigate('/?error=no_session');
            return;
          }

          // User exists but no session - this is normal for OAuth
          console.log('OAuth user authenticated:', userData.user.email);

          // Redirect back to the original page
          const redirectUrl = localStorage.getItem('auth_redirect_url');
          localStorage.removeItem('auth_redirect_url');

          if (redirectUrl && redirectUrl !== window.location.origin + '/auth/callback') {
            window.location.href = redirectUrl;
          } else {
            navigate('/');
          }
          return;
        }

        if (authData.session) {
          // For new Google OAuth users, set portal_type to customer and create profile
          const userPortalType = authData.session.user.user_metadata?.portal_type;

          if (!userPortalType) {
            console.log('New Google OAuth user, setting portal_type to customer');

            // Check if a customer profile already exists with this email
            const userEmail = authData.session.user.email;
            let existingCustomer = null;

            if (userEmail) {
              try {
                const { data: customerData, error: customerCheckError } = await supabase
                  .from('customer')
                  .select('id, auth_user_id')
                  .eq('email', userEmail)
                  .maybeSingle();

                if (!customerCheckError && customerData) {
                  existingCustomer = customerData;
                  console.log('Found existing customer profile with same email:', customerData);
                }
              } catch (error) {
                console.log('Error checking for existing customer:', error);
              }
            }

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

            // Handle customer profile creation or linking
            try {
              if (existingCustomer && existingCustomer.auth_user_id !== authData.session.user.id) {
                // Link the existing customer profile to the new Google auth user
                console.log('Linking existing customer profile to Google OAuth user');

                const { error: linkError } = await supabase
                  .from('customer')
                  .update({
                    auth_user_id: authData.session.user.id,
                    updated_at: new Date().toISOString(),
                    last_login_at: new Date().toISOString()
                  })
                  .eq('id', existingCustomer.id);

                if (linkError) {
                  console.error('Failed to link existing customer profile:', linkError);
                  // Continue anyway - don't fail the auth process
                } else {
                  console.log('✅ Successfully linked existing customer profile to Google OAuth user');
                }
              } else if (!existingCustomer) {
                // Create new customer profile for new Google OAuth user
                const userMetadata = authData.session.user.user_metadata;
                const fullName = userMetadata?.full_name || userMetadata?.name || '';
                const firstName = userMetadata?.given_name || fullName.split(' ')[0] || 'User';
                const lastName = userMetadata?.family_name || fullName.split(' ').slice(1).join(' ') || '';

                const { error: customerError } = await supabase
                  .from('customer')
                  .insert([{
                    id: authData.session.user.id,
                    auth_user_id: authData.session.user.id,
                    email: userEmail || '',
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: null,
                    gender: 'prefer_not_to_say',
                    profile_completion_percentage: 80,
                    account_status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    last_login_at: new Date().toISOString()
                  }])
                  .select()
                  .single();

                if (customerError) {
                  console.log('Customer profile creation failed:', customerError);
                  // Don't fail the auth process if profile creation fails
                } else {
                  console.log('✅ Customer profile created for Google OAuth user');
                }
              } else {
                console.log('✅ Customer profile already exists and linked correctly');
              }
            } catch (customerError) {
              console.log('Customer profile handling failed:', customerError);
              // Don't fail the auth process
            }

            console.log('✅ Portal type set to customer for Google OAuth user');

            // Redirect back to the original page
            const redirectUrl = localStorage.getItem('auth_redirect_url');
            localStorage.removeItem('auth_redirect_url');

            if (redirectUrl && redirectUrl !== window.location.origin + '/auth/callback') {
              window.location.href = redirectUrl;
            } else {
              navigate('/');
            }
            return;
          }

          // For existing users, just continue with login
          console.log('User authenticated:', authData.session.user);

          // Redirect back to the original page
          const redirectUrl = localStorage.getItem('auth_redirect_url');
          localStorage.removeItem('auth_redirect_url');

          if (redirectUrl && redirectUrl !== window.location.origin + '/auth/callback') {
            window.location.href = redirectUrl;
          } else {
            navigate('/');
          }
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
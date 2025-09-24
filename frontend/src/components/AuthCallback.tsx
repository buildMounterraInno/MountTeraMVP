import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 AuthCallback started, URL:', window.location.href);

        const urlParams = new URLSearchParams(window.location.search);
        const callbackType = urlParams.get('type');

        // Check for OAuth errors in URL
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (error) {
          console.error('❌ OAuth error in URL:', error, errorDescription);
          navigate(`/?error=oauth_failed&message=${encodeURIComponent(errorDescription || error)}`);
          return;
        }

        // Check if this is a password recovery callback
        if (callbackType === 'recovery') {
          console.log('🔄 [DEBUG] Password recovery callback detected');

          // Check if we have a stored new password
          const tempPasswordData = localStorage.getItem('temp_new_password');

          if (tempPasswordData) {
            try {
              const passwordInfo = JSON.parse(tempPasswordData);
              console.log('🟡 [DEBUG] Found stored password for:', passwordInfo.email);

              // Update the password using Supabase's updateUser
              const { error: updateError } = await supabase.auth.updateUser({
                password: passwordInfo.password
              });

              if (updateError) {
                console.error('❌ [DEBUG] Password update failed:', updateError);
                navigate('/?error=password_update_failed');
              } else {
                console.log('✅ [DEBUG] Password updated successfully!');
                localStorage.removeItem('temp_new_password');
                navigate('/?success=password_updated');
              }
              return;
            } catch (error) {
              console.error('❌ [DEBUG] Error processing stored password:', error);
              localStorage.removeItem('temp_new_password');
            }
          }
        }

        console.log('🔄 Processing OAuth callback, URL:', window.location.href);

        // Wait for Supabase to automatically process OAuth callback
        console.log('🔄 Waiting for Supabase OAuth processing...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        let authData: { session: any } | null = null;
        let authError: any = null;
        let retryCount = 0;
        const maxRetries = 5;

        // Retry getting session multiple times
        while (retryCount < maxRetries) {
          console.log(`🔄 Attempt ${retryCount + 1}/${maxRetries} to get session...`);

          const result = await supabase.auth.getSession();
          authData = result.data;
          authError = result.error;

          if (authData?.session) {
            console.log('✅ Session found on attempt', retryCount + 1);
            break;
          }

          if (authError) {
            console.error('❌ Session error on attempt', retryCount + 1, ':', authError);
            break;
          }

          retryCount++;
          if (retryCount < maxRetries) {
            console.log('🔄 No session yet, waiting 1 second...');
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        if (authError) {
          console.error('Auth callback error:', authError);
          navigate('/?error=auth_failed');
          return;
        }

        // If no session, try to get user directly (might be OAuth flow)
        if (!authData?.session) {
          console.log('🔄 No session found, trying getUser() as fallback...');

          // Wait a bit for Supabase to process OAuth callback automatically
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Try to get session again after waiting
          const { data: retrySessionData } = await supabase.auth.getSession();
          if (retrySessionData.session) {
            console.log('✅ Session found after retry!');
            authData = retrySessionData;
          } else {
            // Fallback to getUser
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
        }

        if (authData?.session) {
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
                console.log('🔍 Google user metadata:', userMetadata);

                const fullName = userMetadata?.full_name || userMetadata?.name || '';
                const firstName = userMetadata?.given_name || fullName.split(' ')[0] || 'User';
                const lastName = userMetadata?.family_name || fullName.split(' ').slice(1).join(' ') || '';

                // Extract available Google profile data (basic scopes only)
                const profilePicture = userMetadata?.avatar_url || userMetadata?.picture || null;

                // These fields require additional Google verification, so we'll set them as null
                // Users can complete them later in their profile
                const phoneNumber = null;
                const dateOfBirth = null;
                const gender = 'prefer_not_to_say';

                // Calculate profile completion based on available data
                let completionPercentage = 60; // Base for name + email + profile picture
                if (profilePicture) completionPercentage += 10;

                const { error: customerError } = await supabase
                  .from('customer')
                  .insert([{
                    id: authData.session.user.id,
                    auth_user_id: authData.session.user.id,
                    email: userEmail || '',
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phoneNumber,
                    date_of_birth: dateOfBirth,
                    gender: gender,
                    profile_picture_url: profilePicture,
                    profile_completion_percentage: completionPercentage,
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
        <p className="text-gray-600">Processing Google authentication...</p>
        <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
      </div>
    </div>
  );
};

export default AuthCallback;
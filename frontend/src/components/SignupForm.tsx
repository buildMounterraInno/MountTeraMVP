import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  Loader,
  Check,
} from 'lucide-react';
import { useCustomer } from '../contexts/CustomerContext';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: string;
  acceptTerms: boolean;
}

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    gender: '',
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { createCustomer } = useCustomer();

  const handleInputChange = (
    field: keyof SignupFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    // Phone validation (optional)
    if (
      formData.phone_number &&
      !/^\+?[\d\s-()]+$/.test(formData.phone_number)
    ) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // First create the auth user with Supabase
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            portal_type: 'customer',
            first_name: formData.first_name,
            last_name: formData.last_name,
          },
        },
      });

      if (error) {
        console.error('Auth signup error:', error);

        // Handle different types of auth errors
        if (
          error.message.toLowerCase().includes('already registered') ||
          error.message.toLowerCase().includes('user already registered') ||
          error.message.toLowerCase().includes('email already registered')
        ) {
          // Check if this is an orphaned auth user (auth exists but no customer profile)
          try {
            const { data: existingSession, error: signInError } =
              await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
              });

            if (signInError) {
              // Fall back to standard error message
              setErrors({
                email:
                  'This email is already registered. Please try logging in instead.',
              });
              setTimeout(() => {
                const switchToLogin = confirm(
                  'This email is already registered. Would you like to switch to the login form?'
                );
                if (switchToLogin) {
                  onSwitchToLogin();
                }
              }, 1500);
              return;
            }

            if (existingSession.user) {
              // Try to fetch customer profile
              const { data: customerData, error: customerError } =
                await supabase
                  .from('customer')
                  .select('id')
                  .eq('id', existingSession.user.id)
                  .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

              if (customerError) {
                console.error(
                  'Error checking customer profile:',
                  customerError
                );
                // Fall back to standard error handling
                await supabase.auth.signOut();
                setErrors({
                  email:
                    'This email is already registered. Please try logging in instead.',
                });
                return;
              }

              if (!customerData) {
                // No customer profile exists - this is an orphaned auth user

                try {
                  await createCustomer(
                    {
                      email: formData.email,
                      first_name: formData.first_name,
                      last_name: formData.last_name,
                      phone_number: formData.phone_number || undefined,
                      gender: formData.gender,
                      profile_completion_percentage: 100,
                    },
                    existingSession.user.id
                  ); // Pass the user ID directly

                  onSuccess(); // Profile creation successful, proceed with login
                  return;
                } catch (customerCreateError) {
                  console.error(
                    'Failed to create customer profile for orphaned user:',
                    customerCreateError
                  );
                  await supabase.auth.signOut(); // Sign out the user
                  setErrors({
                    general:
                      'Account setup incomplete. Please try signing up again or contact support.',
                  });
                  return;
                }
              } else {
                // Customer profile exists - this is a duplicate signup
                await supabase.auth.signOut(); // Sign out to prevent session issues
                setErrors({
                  email:
                    'This email is already registered. Please try logging in instead.',
                });

                // Show a helpful prompt to switch to login
                setTimeout(() => {
                  const switchToLogin = confirm(
                    'This email is already registered. Would you like to switch to the login form?'
                  );
                  if (switchToLogin) {
                    onSwitchToLogin();
                  }
                }, 1500);
                return;
              }
            }
          } catch (loginCheckError) {
            // Fall back to standard error message
            setErrors({
              email:
                'This email is already registered. Please try logging in instead.',
            });

            // Show a helpful prompt to switch to login
            setTimeout(() => {
              const switchToLogin = confirm(
                'This email is already registered. Would you like to switch to the login form?'
              );
              if (switchToLogin) {
                onSwitchToLogin();
              }
            }, 1500);
            return;
          }
        } else if (
          error.message.toLowerCase().includes('email not confirmed') ||
          error.message.toLowerCase().includes('email not verified')
        ) {
          setErrors({
            email:
              'Please check your email and click the confirmation link to verify your account.',
          });
        } else if (error.message.toLowerCase().includes('password')) {
          setErrors({ password: error.message });
        } else if (error.message.toLowerCase().includes('email')) {
          setErrors({ email: error.message });
        } else if (
          error.message.toLowerCase().includes('rate limit') ||
          error.message.toLowerCase().includes('too many')
        ) {
          setErrors({
            general:
              'Too many signup attempts. Please wait a few minutes and try again.',
          });
        } else {
          setErrors({
            general:
              error.message || 'Failed to create account. Please try again.',
          });
        }
        return;
      }

      if (data.user && data.session) {
        try {
          // Create customer profile
          await createCustomer(
            {
              email: formData.email,
              first_name: formData.first_name,
              last_name: formData.last_name,
              phone_number: formData.phone_number || undefined,
              gender: formData.gender,
              profile_completion_percentage: 100,
            },
            data.user.id
          ); // Pass the user ID directly

          console.log('Customer profile created successfully');
          onSuccess();
        } catch (customerError) {
          console.error('Error creating customer profile:', customerError);

          // Check if customer profile already exists (duplicate key error)
          const error = customerError as Error & { code?: string };
          if (
            error?.message?.includes('duplicate') ||
            error?.code === '23505' ||
            error?.message?.includes('already exists')
          ) {
            setErrors({
              general:
                'This account already has a profile. Please try logging in instead.',
            });
            return;
          }

          // For other errors, provide helpful message and sign out the user
          try {
            const { supabase } = await import('../lib/supabase');
            await supabase.auth.signOut();
            console.log('Signed out user after profile creation failure');
          } catch (signOutError) {
            console.error('Failed to sign out user:', signOutError);
          }

          setErrors({
            general:
              'Profile setup failed. Please try signing up again. If this continues, contact support.',
          });
        }
      } else {
        setErrors({
          general:
            'Account created successfully! Please check your email to verify your account before signing in.',
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({
        general:
          'An unexpected error occurred during signup. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-h-[95vh] overflow-y-auto sm:max-h-[80vh]">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="mb-3 text-center sm:mb-4">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            Create Your Account
          </h2>
          <p className="mt-1 text-xs text-gray-600 sm:text-sm">
            Join TripPeChaloand start your adventure
          </p>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  handleInputChange('first_name', e.target.value)
                }
                className={`w-full rounded-lg border py-2.5 pr-3 pl-8 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:py-2 sm:pl-9 ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="First name"
                disabled={isLoading}
              />
            </div>
            {errors.first_name && (
              <p className="mt-0.5 text-xs text-red-500 sm:mt-1">
                {errors.first_name}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className={`w-full rounded-lg border py-2.5 pr-3 pl-8 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:py-2 sm:pl-9 ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Last name"
                disabled={isLoading}
              />
            </div>
            {errors.last_name && (
              <p className="mt-0.5 text-xs text-red-500 sm:mt-1">
                {errors.last_name}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full rounded-lg border py-2.5 pr-3 pl-8 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:py-2 sm:pl-9 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="mt-0.5 text-xs text-red-500 sm:mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) =>
                handleInputChange('phone_number', e.target.value)
              }
              className={`w-full rounded-lg border py-2.5 pr-3 pl-8 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:py-2 sm:pl-9 ${
                errors.phone_number ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Phone number (optional)"
              disabled={isLoading}
            />
          </div>
          {errors.phone_number && (
            <p className="mt-0.5 text-xs text-red-500 sm:mt-1">
              {errors.phone_number}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:py-2 ${
              errors.gender ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
          {errors.gender && (
            <p className="mt-0.5 text-xs text-red-500 sm:mt-1">
              {errors.gender}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full rounded-lg border py-2.5 pr-10 pl-8 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:py-2 sm:pl-9 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.5 right-3 h-4 w-4 touch-manipulation text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-0.5 text-xs text-red-500 sm:mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange('confirmPassword', e.target.value)
              }
              className={`w-full rounded-lg border py-2.5 pr-10 pl-8 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:py-2 sm:pl-9 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-2.5 right-3 h-4 w-4 touch-manipulation text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-0.5 text-xs text-red-500 sm:mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-start gap-2 sm:gap-3">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={(e) =>
                handleInputChange('acceptTerms', e.target.checked)
              }
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 sm:mt-1"
              disabled={isLoading}
            />
            <label
              htmlFor="acceptTerms"
              className="text-xs leading-relaxed text-gray-600 sm:text-sm"
            >
              I agree to the{' '}
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700"
              >
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700"
              >
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="mt-0.5 text-xs text-red-500 sm:mt-1">
              {errors.acceptTerms}
            </p>
          )}
        </div>

        {/* General Error/Success */}
        {errors.general && (
          <div
            className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
              errors.general.includes('successfully') ||
              errors.general.includes('check your email')
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {errors.general.includes('successfully') ||
            errors.general.includes('check your email') ? (
              <Check className="h-4 w-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
            )}
            {errors.general}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full touch-manipulation items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-400 sm:py-2.5"
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Switch to Login */}
        <div className="pt-2 text-center sm:pt-3">
          <p className="text-xs text-gray-600 sm:text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="touch-manipulation font-medium text-blue-600 hover:text-blue-700"
              disabled={isLoading}
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;

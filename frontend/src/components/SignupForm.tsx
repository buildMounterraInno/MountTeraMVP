import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Calendar,
  Eye, 
  EyeOff,
  AlertCircle,
  Loader,
  Check
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
  date_of_birth: string;
}

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    gender: '',
    date_of_birth: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { createCustomer } = useCustomer();

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
    if (formData.phone_number && !/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    // Date of birth validation
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 13) {
        newErrors.date_of_birth = 'You must be at least 13 years old';
      } else if (age > 120) {
        newErrors.date_of_birth = 'Please enter a valid date of birth';
      }
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
            last_name: formData.last_name
          }
        }
      });

      if (error) {
        console.error('Auth signup error:', error);
        
        // Handle different types of auth errors
        if (error.message.toLowerCase().includes('already registered') ||
            error.message.toLowerCase().includes('user already registered') ||
            error.message.toLowerCase().includes('email already registered')) {

          // Check if this is an orphaned auth user (auth exists but no customer profile)
          try {
            const { data: existingSession, error: signInError } = await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password
            });


            if (signInError) {
              // Fall back to standard error message
              setErrors({ email: 'This email is already registered. Please try logging in instead.' });
              setTimeout(() => {
                const switchToLogin = confirm('This email is already registered. Would you like to switch to the login form?');
                if (switchToLogin) {
                  onSwitchToLogin();
                }
              }, 1500);
              return;
            }

            if (existingSession.user) {

              // Try to fetch customer profile
              const { data: customerData, error: customerError } = await supabase
                .from('customer')
                .select('id')
                .eq('id', existingSession.user.id)
                .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

              if (customerError) {
                console.error('Error checking customer profile:', customerError);
                // Fall back to standard error handling
                await supabase.auth.signOut();
                setErrors({ email: 'This email is already registered. Please try logging in instead.' });
                return;
              }

              if (!customerData) {
                // No customer profile exists - this is an orphaned auth user

                try {
                  await createCustomer({
                    email: formData.email,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone_number: formData.phone_number || undefined,
                    gender: formData.gender,
                    date_of_birth: formData.date_of_birth,
                    profile_completion_percentage: 100
                  }, existingSession.user.id); // Pass the user ID directly

                  onSuccess(); // Profile creation successful, proceed with login
                  return;
                } catch (customerCreateError) {
                  console.error('Failed to create customer profile for orphaned user:', customerCreateError);
                  await supabase.auth.signOut(); // Sign out the user
                  setErrors({
                    general: 'Account setup incomplete. Please try signing up again or contact support.'
                  });
                  return;
                }
              } else {
                // Customer profile exists - this is a duplicate signup
                await supabase.auth.signOut(); // Sign out to prevent session issues
                setErrors({ email: 'This email is already registered. Please try logging in instead.' });

                // Show a helpful prompt to switch to login
                setTimeout(() => {
                  const switchToLogin = confirm('This email is already registered. Would you like to switch to the login form?');
                  if (switchToLogin) {
                    onSwitchToLogin();
                  }
                }, 1500);
                return;
              }
            }
          } catch (loginCheckError) {
            // Fall back to standard error message
            setErrors({ email: 'This email is already registered. Please try logging in instead.' });

            // Show a helpful prompt to switch to login
            setTimeout(() => {
              const switchToLogin = confirm('This email is already registered. Would you like to switch to the login form?');
              if (switchToLogin) {
                onSwitchToLogin();
              }
            }, 1500);
            return;
          }
        } else if (error.message.toLowerCase().includes('email not confirmed') || 
                   error.message.toLowerCase().includes('email not verified')) {
          setErrors({ email: 'Please check your email and click the confirmation link to verify your account.' });
        } else if (error.message.toLowerCase().includes('password')) {
          setErrors({ password: error.message });
        } else if (error.message.toLowerCase().includes('email')) {
          setErrors({ email: error.message });
        } else if (error.message.toLowerCase().includes('rate limit') || 
                   error.message.toLowerCase().includes('too many')) {
          setErrors({ general: 'Too many signup attempts. Please wait a few minutes and try again.' });
        } else {
          setErrors({ general: error.message || 'Failed to create account. Please try again.' });
        }
        return;
      }

      if (data.user && data.session) {
        try {
          // Create customer profile
          await createCustomer({
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number || undefined,
            gender: formData.gender,
            date_of_birth: formData.date_of_birth,
            profile_completion_percentage: 100
          }, data.user.id); // Pass the user ID directly

          console.log('Customer profile created successfully');
          onSuccess();
        } catch (customerError) {
          console.error('Error creating customer profile:', customerError);
          
          // Check if customer profile already exists (duplicate key error)
          const error = customerError as Error & { code?: string };
          if (error?.message?.includes('duplicate') || error?.code === '23505' || error?.message?.includes('already exists')) {
            setErrors({ 
              general: 'This account already has a profile. Please try logging in instead.' 
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
            general: 'Profile setup failed. Please try signing up again. If this continues, contact support.' 
          });
        }
      } else {
        setErrors({ 
          general: 'Account created successfully! Please check your email to verify your account before signing in.' 
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'An unexpected error occurred during signup. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Create Your Account</h2>
          <p className="text-gray-600 mt-1 text-sm">Join MountTera and start your adventure</p>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="First name"
                disabled={isLoading}
              />
            </div>
            {errors.first_name && (
              <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Last name"
                disabled={isLoading}
              />
            </div>
            {errors.last_name && (
              <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                errors.phone_number ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Phone number (optional)"
              disabled={isLoading}
            />
          </div>
          {errors.phone_number && (
            <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
          )}
        </div>

        {/* Gender and Date of Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
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
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.date_of_birth && (
              <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full pl-9 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full pl-9 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* General Error/Success */}
        {errors.general && (
          <div className={`p-3 border rounded-lg flex items-center gap-2 text-sm ${
            errors.general.includes('successfully') || errors.general.includes('check your email')
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {errors.general.includes('successfully') || errors.general.includes('check your email') ? (
              <Check className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            {errors.general}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Switch to Login */}
        <div className="text-center pt-3">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium"
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
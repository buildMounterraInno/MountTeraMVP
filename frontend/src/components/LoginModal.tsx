import { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { signIn } from '../lib/auth';
import SignupForm from './SignupForm';
import ForgotPasswordModal from './ForgotPasswordModal';
import GoogleSSOButton from './GoogleSSOButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setErrors({});
      setEmail('');
      setPassword('');
      onClose();
    }, 200); // Match animation duration
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
        // Proceed with sign-in directly
        const { user, error } = await signIn(email, password);
        if (error) {
          if (error.message.toLowerCase().includes('invalid login credentials') ||
                     error.message.toLowerCase().includes('invalid email or password') ||
                     error.message.toLowerCase().includes('incorrect password') ||
                     error.message.toLowerCase().includes('wrong password')) {
            // For security reasons, Supabase returns the same error for non-existent emails and wrong passwords
            setErrors({ general: 'Invalid email or password. Please check your credentials or create a new account if you don\'t have one.' });
          } else if (error.message.toLowerCase().includes('email not confirmed') ||
                     error.message.toLowerCase().includes('email not verified')) {
            setErrors({ email: 'Please check your email and click the confirmation link before logging in.' });
          } else if (error.message.toLowerCase().includes('user not found') ||
                     error.message.toLowerCase().includes('email not found')) {
            setErrors({ general: 'Invalid email or password. Please check your credentials or create a new account if you don\'t have one.' });
          } else if (error.message.toLowerCase().includes('email')) {
            setErrors({ email: error.message });
          } else if (error.message.toLowerCase().includes('password')) {
            setErrors({ password: error.message });
          } else {
            setErrors({ general: error.message });
          }
        } else if (user) {
          console.log('User signed in:', user);
          handleClose();
        }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error: string) => {
    setErrors({ general: error });
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 ${
          isClosing ? 'animate-fade-out' : 'animate-fade-in'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 ${
        isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}>
        <div className={`relative w-full ${
          isSignUp ? 'max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden' : 'max-w-md'
        } bg-white rounded-xl sm:rounded-2xl shadow-2xl transform transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}>
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10 touch-manipulation"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Modal Content */}
          <div className={`${isSignUp ? 'p-4 sm:p-6' : 'p-6 sm:p-8'} ${isSignUp ? 'max-h-[95vh] sm:max-h-[90vh] overflow-y-auto' : ''}`}>
            {/* Render SignupForm for signup */}
            {isSignUp ? (
              <SignupForm 
                onSuccess={handleClose}
                onSwitchToLogin={() => setIsSignUp(false)}
              />
            ) : (
              <>
                {/* Title */}
                <h2 className="font-tpc text-xl sm:text-2xl font-bold text-gray-800 text-center mb-4 sm:mb-6">
                  Login
                </h2>

            {/* General Success/Info Messages */}
            {errors.general && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                errors.general.includes('sent') || errors.general.includes('success') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {errors.general}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[#1E63EF] focus:border-transparent outline-none transition-all duration-200 text-base ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field - Hide for forgot password */}
              {(
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-3 sm:px-4 py-3 pr-11 sm:pr-12 border rounded-lg focus:ring-2 focus:ring-[#1E63EF] focus:border-transparent outline-none transition-all duration-200 text-base ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 touch-manipulation"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              )}

              {/* Forgot Password */}
              {(
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-sm text-[#1E63EF] hover:text-[#E31E56] font-medium transition-colors duration-200"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}



              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E63EF] hover:bg-[#E31E56] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 touch-manipulation text-base"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>

            {/* Terms Disclaimer - Hide for forgot password */}
            {(
              <div className="text-center mt-4 mb-4">
                <p className="text-xs text-gray-500">
                  By logging in, you agree to our{' '}
                  <a
                    href="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1E63EF] hover:text-[#E31E56] font-medium transition-colors duration-200"
                  >
                    Terms & Conditions
                  </a>
                  .
                </p>
              </div>
            )}

            {/* Divider - Hide for forgot password */}
            {(
              <>
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Google SSO Button */}
                <GoogleSSOButton
                  onError={handleGoogleError}
                  loading={loading}
                  setLoading={setLoading}
                />

                {/* Toggle Login/Signup - Hide for forgot password */}
                <div className="text-center mt-4 sm:mt-6">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="text-[#1E63EF] hover:text-[#E31E56] font-medium transition-colors duration-200 touch-manipulation"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </>
            )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </>
  );
};

export default LoginModal;
import { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { signIn, resetPassword, checkEmailExists } from '../lib/auth';
import SignupForm from './SignupForm';
import ForgotPasswordModal from './ForgotPasswordModal';

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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setErrors({});
      setShowForgotPassword(false);
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
      if (showForgotPassword) {
        const { error } = await resetPassword(email);
        if (error) {
          if (error.message.toLowerCase().includes('email') || error.message.toLowerCase().includes('user not found')) {
            setErrors({ email: 'Email address not found. Please check your email.' });
          } else {
            setErrors({ general: error.message });
          }
        } else {
          setErrors({ general: 'Password reset email sent! Check your inbox.' });
          setShowForgotPassword(false);
        }
      } else {
        // First check if email exists
        const { exists, error: emailCheckError } = await checkEmailExists(email);

        if (emailCheckError) {
          // If there's an error checking email (rate limiting, network issues), proceed with normal sign-in
          console.warn('Could not check email existence, proceeding with sign-in:', emailCheckError);
        } else if (!exists) {
          // Email doesn't exist in the system
          setErrors({
            email: 'Please check the email address spelling or create a new account as this email does not exist.'
          });
          setLoading(false);
          return;
        }

        // Email exists (or we couldn't check), proceed with sign-in
        const { user, error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('different portal')) {
            setErrors({ email: 'This account is registered for the vendor portal. Please use the vendor login page.' });
          } else if (error.message.toLowerCase().includes('invalid login credentials') ||
                     error.message.toLowerCase().includes('invalid email or password') ||
                     error.message.toLowerCase().includes('incorrect password') ||
                     error.message.toLowerCase().includes('wrong password')) {
            // Since we already confirmed email exists, this must be a password issue
            setErrors({ password: 'Password is wrong. Please check your password or reset it.' });
          } else if (error.message.toLowerCase().includes('email not confirmed') ||
                     error.message.toLowerCase().includes('email not verified')) {
            setErrors({ email: 'Please check your email and click the confirmation link before logging in.' });
          } else if (error.message.toLowerCase().includes('user not found') ||
                     error.message.toLowerCase().includes('email not found')) {
            setErrors({ email: 'Please check the email address spelling or create a new account as this email does not exist.' });
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
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleSSO = async () => {
  //   setLoading(true);
  //   setErrors({});

  //   try {
  //     const { error } = await signInWithGoogle();
  //     if (error) {
  //       if (error.message.includes('different portal')) {
  //         setErrors({ email: 'This Google account is registered for the vendor portal. Please use the vendor login page.' });
  //       } else {
  //         setErrors({ general: error.message });
  //       }
  //     }
  //   } catch (error) {
  //     setErrors({ general: 'Failed to sign in with Google. Please try again.' });
  //     console.error('Google auth error:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
                  {showForgotPassword ? 'Reset Password' : 'Login'}
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
              {!showForgotPassword && (
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
              {!showForgotPassword && (
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

              {/* Back to login */}
              {showForgotPassword && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-sm text-[#1E63EF] hover:text-[#E31E56] font-medium transition-colors duration-200"
                  >
                    Back to Login
                  </button>
                </div>
              )}


              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E63EF] hover:bg-[#E31E56] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 touch-manipulation text-base"
              >
                {loading ? 'Loading...' : showForgotPassword ? 'Send Reset Email' : 'Login'}
              </button>
            </form>

            {/* Terms Disclaimer - Hide for forgot password */}
            {!showForgotPassword && (
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
            {!showForgotPassword && (
              <>
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Google SSO Button */}
                {/* <button
                  onClick={handleGoogleSSO}
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button> */}

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
import { useState, useEffect } from 'react';
import { Mail, X, CheckCircle, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { sendPasswordResetOTP} from '../lib/auth';
import { supabase } from '../lib/supabase';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'email' | 'otp' | 'password' | 'success' | 'error'>('email');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Timer effect for resend button
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Email is required');
      setStatus('error');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      setStatus('error');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await sendPasswordResetOTP(email);

      if (error) {
        setErrorMessage(error.message);
        setStatus('error');
      } else {
        setStatus('otp');
        // Start 45-second timer for resend
        setResendTimer(45);
        setCanResend(false);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (value && !/^\d$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setSuccessMessage('');

    try {
      const { error } = await sendPasswordResetOTP(email);

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('New OTP sent successfully!');
        // Start new 45-second timer
        setResendTimer(45);
        setCanResend(false);
      }
    } catch (error) {
      setErrorMessage('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the OTP');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('🔵 Verifying OTP:', otpString, 'for email:', email);

      // Verify the password reset token/OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpString,
        type: 'recovery'
      });

      console.log('🔵 Verification result:', { data, error });

      if (error) {
        console.log('❌ OTP verification failed:', error.message);
        setErrorMessage(`Invalid or expired OTP code: ${error.message}`);
        setLoading(false);
        return;
      }

      if (!data.user || !data.session) {
        console.log('❌ No user/session returned');
        setErrorMessage('Invalid or expired OTP code. Please try again.');
        setLoading(false);
        return;
      }

      console.log('✅ OTP verified successfully!');

      // OTP verified - user is now authenticated, move to password step
      // DON'T sign out - we need the session to update password
      setStatus('password');
    } catch (error) {
      setErrorMessage('Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      setErrorMessage('Password is required');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Update password directly - user is already authenticated from OTP verification
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        // Password updated successfully
        // Sign out the user so they have to login with new password
        await supabase.auth.signOut();
        setStatus('success');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    // SECURITY: Always sign out when closing modal to prevent unwanted login
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log('Sign out error on close:', error);
    }

    // Simple cleanup - just reset everything and close
    setEmail('');
    setOtp(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setStatus('email');
    setErrorMessage('');
    setSuccessMessage('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLoading(false);
    setResendTimer(0);
    setCanResend(false);
    onClose();
  };

  const handleBackToEmail = async () => {
    // SECURITY: Sign out when going back to prevent unwanted login
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log('Sign out error on back:', error);
    }

    setOtp(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setStatus('email');
    setErrorMessage('');
    setSuccessMessage('');
    setResendTimer(0);
    setCanResend(false);
  };

  const handleBackToOtp = () => {
    // Don't sign out here - user might want to try different password
    setNewPassword('');
    setConfirmPassword('');
    setStatus('otp');
    setErrorMessage('');
    setSuccessMessage('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all duration-200">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Modal Content */}
          <div className="p-8">
            {/* Error Message - Show on any step if there's an error */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-start gap-3">
                <X className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            {/* Success Message - Show on any step if there's a success */}
            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            {/* Step 1: Email */}
            {status === 'email' && (
              <>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>

                <h2 className="font-tpc text-2xl font-bold text-gray-800 text-center mb-4">
                  Reset Password
                </h2>

                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Enter your email address and we'll send you an OTP code.
                </p>

                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="reset-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E63EF] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1E63EF] hover:bg-[#E31E56] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>

                <button
                  onClick={handleClose}
                  className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 mt-4 transition-colors duration-200"
                >
                  Back to Login
                </button>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {status === 'otp' && (
              <>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>

                <h2 className="font-tpc text-2xl font-bold text-gray-800 text-center mb-4">
                  Enter OTP Code
                </h2>

                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  We've sent a 6-digit code to <strong>{email}</strong>
                </p>

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                      Enter 6-digit OTP Code
                    </label>
                    <div className="flex justify-center gap-3 mb-4">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E63EF] focus:border-transparent outline-none transition-all duration-200"
                          maxLength={1}
                          autoComplete="off"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full bg-[#1E63EF] hover:bg-[#E31E56] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </form>

                <div className="mt-4 space-y-3">
                  {/* Resend OTP button */}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={!canResend || loading}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {canResend
                      ? 'Send OTP Again'
                      : `Resend in ${resendTimer}s`
                    }
                  </button>

                  <button
                    onClick={handleBackToEmail}
                    className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors duration-200"
                  >
                    Back to Email
                  </button>
                </div>
              </>
            )}

            {/* Step 3: New Password */}
            {status === 'password' && (
              <>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>

                <h2 className="font-tpc text-2xl font-bold text-gray-800 text-center mb-4">
                  Set New Password
                </h2>

                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Enter your new password below
                </p>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E63EF] focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E63EF] focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium mb-1">Password requirements:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>At least 8 characters long</li>
                      <li>Must match confirmation password</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1E63EF] hover:bg-[#E31E56] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                  >
                    {loading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>

                <button
                  onClick={handleBackToOtp}
                  className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 mt-4 transition-colors duration-200"
                >
                  Back to OTP
                </button>
              </>
            )}

            {/* Step 4: Success */}
            {status === 'success' && (
              <>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>

                <h2 className="font-tpc text-2xl font-bold text-gray-800 text-center mb-4">
                  Password Updated!
                </h2>

                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Your password has been successfully updated. You can now log in with your new password.
                </p>

                <button
                  onClick={handleClose}
                  className="w-full bg-[#1E63EF] hover:bg-[#E31E56] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Continue to Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordModal;
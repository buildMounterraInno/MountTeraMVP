import { useState } from 'react';
import { Mail, Bug, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { sendPasswordResetOTP, verifyOTPAndUpdatePassword } from '../lib/auth';
import { supabase } from '../lib/supabase';

const OTPDebugger = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [step, setStep] = useState<'email' | 'otp'>('email');

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    setDebugLogs(prev => [`[${timestamp}] ${emoji} ${message}`, ...prev]);
  };

  const clearLogs = () => {
    setDebugLogs([]);
  };

  const checkSupabaseConfig = async () => {
    addLog('Checking Supabase configuration...');

    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        addLog(`Supabase session error: ${error.message}`, 'error');
      } else {
        addLog(`Supabase connection: OK`, 'success');
        addLog(`Current session: ${session ? 'Authenticated' : 'Not authenticated'}`);
      }

      // Test basic Supabase functionality
      const { data, error: testError } = await supabase.auth.getUser();

      if (testError) {
        addLog(`Supabase auth test error: ${testError.message}`, 'error');
      } else {
        addLog(`Supabase auth test: OK`, 'success');
        addLog(`Current user: ${data.user?.email || 'None'}`);
      }

      // Check environment variables
      addLog(`VITE_SUPABASE_URL: ${import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing'}`,
        import.meta.env.VITE_SUPABASE_URL ? 'success' : 'error');
      addLog(`VITE_SUPABASE_ANON_KEY: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}`,
        import.meta.env.VITE_SUPABASE_ANON_KEY ? 'success' : 'error');

    } catch (error) {
      addLog(`Supabase config check failed: ${error}`, 'error');
    }
  };

  const testSendOTP = async () => {
    if (!email) {
      addLog('Please enter an email address', 'error');
      return;
    }

    setLoading(true);
    addLog(`Starting OTP send test for: ${email}`);

    try {
      const { error } = await sendPasswordResetOTP(email);

      if (error) {
        addLog(`OTP send failed: ${error.message}`, 'error');
        addLog(`Error details: ${JSON.stringify(error)}`, 'error');
      } else {
        addLog(`OTP send successful! Check your email.`, 'success');
        setStep('otp');
      }
    } catch (error) {
      addLog(`OTP send exception: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testVerifyOTP = async () => {
    if (!otp || !newPassword) {
      addLog('Please enter both OTP and new password', 'error');
      return;
    }

    setLoading(true);
    addLog(`Starting OTP verification test...`);

    try {
      const { error } = await verifyOTPAndUpdatePassword(email, otp, newPassword);

      if (error) {
        addLog(`OTP verification failed: ${error.message}`, 'error');
        addLog(`Error details: ${JSON.stringify(error)}`, 'error');
      } else {
        addLog(`OTP verification successful! Password updated.`, 'success');
        setStep('email');
        setOtp('');
        setNewPassword('');
      }
    } catch (error) {
      addLog(`OTP verification exception: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testDirectPasswordReset = async () => {
    if (!email) {
      addLog('Please enter an email address', 'error');
      return;
    }

    setLoading(true);
    addLog(`Testing direct password reset for: ${email}`);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        addLog(`Direct password reset failed: ${error.message}`, 'error');
        addLog(`Error code: ${error.status}`, 'error');
        addLog(`Full error: ${JSON.stringify(error)}`, 'error');
      } else {
        addLog(`Direct password reset request successful!`, 'success');
        addLog(`Check your email for a password reset link (not OTP)`, 'info');
      }
    } catch (error) {
      addLog(`Direct password reset exception: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testDirectOTPLogin = async () => {
    if (!email) {
      addLog('Please enter an email address', 'error');
      return;
    }

    setLoading(true);
    addLog(`Testing signInWithOtp for: ${email}`);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error) {
        addLog(`OTP login failed: ${error.message}`, 'error');
        addLog(`Error code: ${error.status}`, 'error');
        addLog(`Full error: ${JSON.stringify(error)}`, 'error');
      } else {
        addLog(`OTP login request successful!`, 'success');
        addLog(`Check your email for an OTP code`, 'info');
        setStep('otp');
      }
    } catch (error) {
      addLog(`OTP login exception: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Bug className="w-8 h-8 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800">OTP Debug Console</h2>
      </div>

      {/* Configuration Check */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Configuration Check</h3>
        <button
          onClick={checkSupabaseConfig}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Check Supabase Config
        </button>
      </div>

      {/* Email Testing */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Email Testing</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="test@example.com"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={testSendOTP}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send OTP (Via Our Function)'}
            </button>

            <button
              onClick={testDirectOTPLogin}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test Direct OTP Login
            </button>

            <button
              onClick={testDirectPasswordReset}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test Direct Reset (Link)
            </button>
          </div>
        </div>
      </div>

      {/* OTP Verification */}
      {step === 'otp' && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">OTP Verification</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                6-Digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-center text-xl tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>

            <button
              onClick={testVerifyOTP}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </div>
      )}

      {/* Debug Logs */}
      <div className="p-4 bg-gray-900 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Debug Logs</h3>
          <button
            onClick={clearLogs}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Clear Logs
          </button>
        </div>

        <div className="bg-black rounded p-3 h-64 overflow-y-auto font-mono text-sm">
          {debugLogs.length === 0 ? (
            <div className="text-gray-400 italic">No logs yet...</div>
          ) : (
            debugLogs.map((log, index) => (
              <div
                key={index}
                className={`mb-1 ${
                  log.includes('✅')
                    ? 'text-green-400'
                    : log.includes('❌')
                    ? 'text-red-400'
                    : 'text-gray-300'
                }`}
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Debug Instructions
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>First, click "Check Supabase Config" to verify your setup</li>
          <li>Enter your email address and click "Send OTP" to test email delivery</li>
          <li>Check your email (including spam folder) for the OTP</li>
          <li>If you receive an OTP, enter it along with a new password and click "Verify OTP"</li>
          <li>If no OTP is received, try "Test Direct Reset" to test the basic password reset flow</li>
          <li>Check the console logs for detailed error information</li>
        </ol>
      </div>

      {/* Common Issues */}
      <div className="mt-6 p-4 bg-red-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-500" />
          Common Issues
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li><strong>No email received:</strong> Check Supabase SMTP settings in dashboard</li>
          <li><strong>Invalid credentials error:</strong> Verify email exists in your auth.users table</li>
          <li><strong>Rate limiting:</strong> Wait 60 seconds between requests</li>
          <li><strong>SMTP not configured:</strong> Set up ZeptoMail in Supabase → Authentication → SMTP Settings</li>
        </ul>
      </div>
    </div>
  );
};

export default OTPDebugger;
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import OTPDebugger from '../components/OTPDebugger';

interface TestData {
  success: boolean;
  data?: any[];
  error?: string;
}

export default function TestPage() {
  const [testResult, setTestResult] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .limit(5);

        if (error) {
          setTestResult({
            success: false,
            error: error.message
          });
        } else {
          setTestResult({
            success: true,
            data: data
          });
        }
      } catch (error) {
        setTestResult({
          success: false,
          error: `Connection failed: ${String(error)}`
        });
      } finally {
        setLoading(false);
      }
    }

    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Testing database connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Supabase Database Connection Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {testResult?.success ? (
            <div>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700 font-semibold">
                  ✅ Connection Successful!
                </span>
              </div>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Articles Data ({testResult.data?.length || 0} records):
              </h2>
              
              <div className="bg-gray-100 rounded-md p-4 overflow-x-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-red-700 font-semibold">
                  ❌ Connection Failed
                </span>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 font-medium">Error:</p>
                <p className="text-red-600 mt-2">{testResult?.error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Connection Details:
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not found'}</p>
            <p><strong>Environment:</strong> {import.meta.env.MODE || 'Unknown'}</p>
            <p><strong>Table:</strong> articles</p>
          </div>
        </div>

        {/* OTP Debug Component */}
        <div className="mt-8">
          <OTPDebugger />
        </div>
      </div>
    </div>
  );
}
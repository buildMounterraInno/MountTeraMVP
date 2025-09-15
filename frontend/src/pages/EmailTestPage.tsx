import React, { useState } from 'react';
import { ZeptoMailService } from '../services/zepto-mail';

const EmailTestPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    eventName: 'Hampta Pass Trek - Test Event',
    customerName: 'John Doe',
    customerEmail: 'rajvaidhyag@gmail.com',
    eventDate: 'Monday, December 15, 2024',
    eventAddress: 'Manali Base Camp, Himachal Pradesh, Near Mall Road, 175131'
  });

  const handleTestEmail = async () => {
    setLoading(true);
    setResult(null);
    try {
      const emailResult = await ZeptoMailService.sendRegistrationEmail(formData);
      if (emailResult.success) {
        setResult(`✅ Email sent successfully! Message ID: ${emailResult.messageId}`);
      } else {
        setResult(`❌ Email failed: ${emailResult.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const emailResult = await ZeptoMailService.sendTestEmail();
      if (emailResult.success) {
        setResult(`✅ Quick test email sent successfully! Message ID: ${emailResult.messageId}`);
      } else {
        setResult(`❌ Quick test failed: ${emailResult.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">📧 ZeptoMail Email Testing</h1>

          <div className="space-y-6">
            {/* Template Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Template Configuration</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Template ID:</strong> 2518b.623682b2828bdc79.k1.54307f80-9085-11f0-a4b7-d2cf08f4ca8c.19942703f78</p>
                <p><strong>Variables:</strong> name, event_name, date, address</p>
                <p><strong>From:</strong> noreply@trippechalo.in</p>
              </div>
            </div>

            {/* Custom Test Form */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Custom Test Email</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                <input
                  type="text"
                  value={formData.eventDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Monday, December 15, 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Address</label>
                <textarea
                  value={formData.eventAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventAddress: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Manali Base Camp, Himachal Pradesh, Near Mall Road, 175131"
                  rows={2}
                />
              </div>

              <button
                onClick={handleTestEmail}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending Email...
                  </>
                ) : (
                  'Send Custom Test Email'
                )}
              </button>
            </div>

            {/* Quick Test */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleQuickTest}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending Quick Test...
                  </>
                ) : (
                  '🚀 Send Quick Test Email (to rajvaidhyag@gmail.com)'
                )}
              </button>
            </div>

            {/* Result Display */}
            {result && (
              <div className={`p-4 rounded-lg ${
                result.includes('✅')
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`font-medium ${
                  result.includes('✅') ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result}
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">How to Test:</h4>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Use the "Quick Test" button to send a predefined test email</li>
                <li>Or customize the form fields and use "Send Custom Test Email"</li>
                <li>Check the recipient email inbox for the templated email</li>
                <li>Verify that all template variables are properly replaced</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTestPage;
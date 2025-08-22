import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { forceUpdateUserMetadata, validatePortalAccess } from '../lib/auth';

const AuthDebug: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleForceUpdate = async () => {
    setLoading(true);
    try {
      await forceUpdateUserMetadata();
      alert('User metadata updated! Please refresh to see changes.');
    } catch (error) {
      console.error('Error updating metadata:', error);
      alert('Failed to update metadata');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded-lg">
        <p>No user logged in</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded-lg max-w-md">
      <h3 className="font-bold mb-2">Auth Debug Panel</h3>
      <div className="space-y-2 text-sm">
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Portal Type:</strong> {user.user_metadata?.portal_type || 'NOT SET'}</p>
        <p><strong>Access Valid:</strong> {validatePortalAccess(user) ? '✅ Yes' : '❌ No'}</p>
        
        <div className="space-y-2 mt-4">
          <button
            onClick={handleForceUpdate}
            disabled={loading}
            className="block w-full bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
          >
            Force Update Metadata
          </button>
        </div>
        
        <p className="text-xs text-gray-300 mt-2">
          ✅ Portal type metadata is working! Remove this debug panel in production.
        </p>
      </div>
    </div>
  );
};

export default AuthDebug;
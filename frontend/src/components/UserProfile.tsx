import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
        <div className="w-8 h-8 bg-[#1E63EF] rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user.email?.charAt(0).toUpperCase() || <User size={16} />}
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700">
          {user.email}
        </span>
      </button>

      {/* Dropdown menu */}
      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-3 border-b">
          <p className="text-sm font-medium text-gray-900">{user.email}</p>
          <p className="text-xs text-gray-500">Signed in</p>
        </div>
        <div className="p-1">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
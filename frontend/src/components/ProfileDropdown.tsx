import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Heart,
  Calendar,
  HelpCircle
} from 'lucide-react';

interface Customer {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  onboarding_completed?: boolean;
}

interface ProfileDropdownProps {
  customer?: Customer | null;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ customer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const openDropdown = () => {
    setIsOpen(true);
    setIsAnimating(true);
  };

  const closeDropdown = () => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 150);
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      closeDropdown();
    } catch (error: any) {
      // Handle auth session missing error gracefully
      if (error.message?.includes('Auth session missing') || error.message?.includes('session missing')) {
        console.log('Session already cleared, closing dropdown');
        closeDropdown();
        return;
      }
      console.error('Sign out error:', error);
      // Still close dropdown even if there's an error
      closeDropdown();
    }
  };

  const getDisplayName = () => {
    if (customer?.first_name && customer?.last_name) {
      return `${customer.first_name} ${customer.last_name}`;
    }
    if (customer?.first_name) {
      return customer.first_name;
    }
    return user?.email?.split('@')[0] || 'Customer';
  };

  const getInitials = () => {
    if (customer?.first_name && customer?.last_name) {
      return `${customer.first_name.charAt(0)}${customer.last_name.charAt(0)}`.toUpperCase();
    }
    if (customer?.first_name) {
      return customer.first_name.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'C';
  };

  const menuItems = [
    {
      icon: User,
      label: 'My Profile',
      path: '/profile',
      description: 'View and edit your profile information'
    },
    {
      icon: Heart,
      label: 'Wishlist',
      path: '/profile?tab=wishlist',
      description: 'Your saved treks and experiences'
    },
    {
      icon: Calendar,
      label: 'My Bookings',
      path: '/my-bookings',
      description: 'View and manage your trek bookings'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="relative">
          {customer?.avatar_url ? (
            <img
              src={customer.avatar_url}
              alt={getDisplayName()}
              className="w-9 h-9 rounded-full object-cover border-2 border-white/30"
            />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold border-2 border-white/30">
              {getInitials()}
            </div>
          )}
        </div>

        {/* User info - Hidden on mobile */}
        <div className="hidden lg:block text-left">
          <p className="text-white text-sm font-medium leading-tight">
            {getDisplayName()}
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown 
          className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`
          absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden
          transform transition-all duration-150 origin-top-right
          ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}>
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {customer?.avatar_url ? (
                <img
                  src={customer.avatar_url}
                  alt={getDisplayName()}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {getInitials()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-900 font-semibold text-base truncate">
                  {getDisplayName()}
                </h3>
                {!customer?.onboarding_completed && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 text-xs font-medium">Complete Setup</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2 max-h-96 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeDropdown}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 group"
                >
                  <div className="flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-150" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium text-sm group-hover:text-blue-900">
                      {item.label}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-tight">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>


          {/* Sign Out */}
          <div className="border-t border-gray-100 p-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 group"
            >
              <LogOut className="w-5 h-5 group-hover:text-red-700 transition-colors duration-150" />
              <span className="font-medium text-sm group-hover:text-red-700">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
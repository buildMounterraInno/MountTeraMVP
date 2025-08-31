import React from 'react';
import ProfileSection from '../components/ProfileSection';
import { useCustomer, Customer } from '../contexts/CustomerContext';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { customer, updateCustomer, loading: customerLoading } = useCustomer();

  // Redirect to home if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/" replace />;
  }

  // Show loading state
  if (authLoading || customerLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const handleUpdateCustomer = async (updates: Partial<Customer>) => {
    await updateCustomer(updates);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8">
      <ProfileSection
        customer={customer}
        onUpdateCustomer={handleUpdateCustomer}
        isLoading={customerLoading}
      />
    </div>
  );
};

export default ProfilePage;
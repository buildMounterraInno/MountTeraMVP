import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './common/Navbar';
import Footer from './common/Footer';
import { CustomerProvider, useCustomer } from '../contexts/CustomerContext';
import { useAuth } from '../contexts/AuthContext';
import ProfileSetupModal from './ProfileSetupModal';

// Inner component that has access to CustomerContext
const MainLayoutContent: React.FC = () => {
  const { user } = useAuth();
  const { customer, loading } = useCustomer();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    // Show profile setup modal if user is authenticated but has no customer profile
    if (user && !loading && !customer) {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
  }, [user, customer, loading]);

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />

        {/* Main content area - Flexible height */}
        <main className="w-full flex-grow">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* Profile Setup Modal for orphaned auth users */}
      <ProfileSetupModal
        isOpen={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
        onSuccess={() => setShowProfileSetup(false)}
      />
    </>
  );
};

function MainLayout() {
  return (
    <CustomerProvider>
      <MainLayoutContent />
    </CustomerProvider>
  );
}

export default MainLayout;

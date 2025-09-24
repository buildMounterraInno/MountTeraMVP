import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './common/Navbar';
import Footer from './common/Footer';
import { CustomerProvider, useCustomer } from '../contexts/CustomerContext';
import { useAuth } from '../contexts/AuthContext';
import { WishlistProvider } from '../contexts/WishlistContext';
import ProfileSetupModal from './ProfileSetupModal';

// Inner component that has access to CustomerContext
const MainLayoutContent: React.FC = () => {
  const { user } = useAuth();
  const { customer, loading } = useCustomer();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    console.log('🔍 MainLayout check:', { user: !!user, loading, customer: !!customer });

    // Show profile setup modal if user is authenticated but has no customer profile
    if (user && !loading && !customer) {
      console.log('❌ Showing profile setup - no customer profile found');
      setShowProfileSetup(true);
    } else {
      console.log('✅ Not showing profile setup');
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
      <WishlistProvider>
        <MainLayoutContent />
      </WishlistProvider>
    </CustomerProvider>
  );
}

export default MainLayout;

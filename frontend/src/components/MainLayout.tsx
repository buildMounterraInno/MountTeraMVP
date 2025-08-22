import { Outlet } from 'react-router-dom';
import Navbar from './common/Navbar';
import Footer from './common/Footer';
import AuthDebug from './AuthDebug';

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Main content area - Flexible height */}
      <main className="w-full flex-grow">
        <Outlet />
      </main>

      <Footer />
      
      {/* Debug panel - remove in production */}
      <AuthDebug />
    </div>
  );
}

export default MainLayout;

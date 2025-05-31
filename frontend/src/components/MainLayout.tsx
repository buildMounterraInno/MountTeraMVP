import { Outlet } from 'react-router-dom';
import Navbar from './common/Navbar';
import Footer from './common/Footer';

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Main content area - Flexible height */}
      <main className="w-full flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;

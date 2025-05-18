import { Outlet } from 'react-router-dom';
import Navbar from './common/Navbar';

function MainLayout() {
  return (
    <div>
      {/* Navbar */}
      <Navbar />
      {/* Path rendered Pages */}
      <Outlet />
      {/* Footer */}
    </div>
  );
}

export default MainLayout;

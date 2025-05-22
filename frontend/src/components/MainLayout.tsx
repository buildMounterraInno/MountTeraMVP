import { Outlet } from 'react-router-dom';
import Navbar from './common/Navbar';
// import Footer from './common/Footer';

function MainLayout() {
  return (
    <div>
      {/* Navbar */}
      <Navbar />
      {/* Path rendered Pages */}
      <Outlet />
      {/* Sherpa AI - WIP */}
      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}

export default MainLayout;

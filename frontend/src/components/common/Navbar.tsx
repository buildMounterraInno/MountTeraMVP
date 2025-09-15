import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User} from 'phosphor-react';
import LoginModal from '../LoginModal';
import ProfileDropdown from '../ProfileDropdown';
import { useAuth } from '../../contexts/AuthContext';
import { useCustomer } from '../../contexts/CustomerContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const { user, loading } = useAuth();
  const { customer, loading: customerLoading } = useCustomer();

  // Navigation data
  const allNavLinks = [
    //{ path: '/', label: 'HOME' },
    { path: '/article', label: 'Article' },
    { path: '/about-us', label: 'About Us' },
   // { path: '/sherpa-ai', label: 'Sherpa AI' },
  ];

  // Filter navigation links based on current page
  const navLinks = isLandingPage 
    ? allNavLinks.filter(link => link.path !== '/')
    : allNavLinks;
  
  //const showHomeIcon = !isLandingPage;

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const closeMenu = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [isOpen]);


  // Glass morphism - always dark
  const glassClasses = 'bg-gradient-to-r from-black/60 to-gray-800/60 backdrop-blur-md';

  return (
    <nav
      className={`font-nav fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'md:py-2 md:px-4' : 'md:py-4 md:px-4'
      }`}
    >
      {/* Desktop Header */}
      <div
        className={`mx-auto max-w-7xl rounded-full px-6 py-3 ${glassClasses} shadow-[0_4px_25px_rgba(0,0,0,0.25)] hidden md:block`}
      >
        <div className="flex items-center justify-between">
          {/* Left Section - Navigation Links */}
          <div className="flex items-center space-x-8">
            {navLinks.filter(link => link.path !== '/').map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="font-nav text-sm text-white/90 transition-colors duration-200 hover:text-white lg:text-base font-normal tracking-wide"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Center Section - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-[url('/src/assets/LogoImage.jpg')] bg-contain bg-no-repeat"></div>
              <div className="-ml-1 h-8 w-32 bg-[url('/src/assets/LogoWritten.jpg')] bg-contain bg-no-repeat"></div>
            </div>
          </div>

          {/* Right Section - Profile & Actions */}
          <div className="flex items-center space-x-4">
            {loading || customerLoading ? (
              <div className="w-8 h-8 animate-pulse bg-white/20 rounded-full"></div>
            ) : user ? (
              <ProfileDropdown customer={customer} />
            ) : (
              <>
                {/* Profile Icon */}
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-white transition-colors duration-200 hover:text-gray-300"
                  aria-label="Profile"
                >
                  <User size={20} weight="regular" />
                </button>

                {/* Become a Vendor Button */}
                <a 
                  href="https://vendor.trippechalo.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-button bg-[#1E63EF] hover:bg-[#1750CC] text-white font-medium px-4 py-1.5 text-sm rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Become a Vendor
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className={`${glassClasses} py-2 md:hidden w-full`}>
        <div className="flex items-center justify-between px-4">
          {/* Mobile Logo */}
          <div className="flex items-center">
            <div className="h-8 w-8 bg-[url('/src/assets/LogoImage.jpg')] bg-contain bg-no-repeat"></div>
            <div className="-ml-1 h-8 w-32 bg-[url('/src/assets/LogoWritten.jpg')] bg-contain bg-no-repeat"></div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-1">
            {loading || customerLoading ? (
              <div className="w-8 h-8 animate-pulse bg-white/20 rounded-full"></div>
            ) : user ? (
              <div className="relative">
                {customer?.avatar_url ? (
                  <img
                    src={customer.avatar_url}
                    alt={customer.first_name || 'Profile'}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white/30">
                    {customer?.first_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="p-2 text-white transition-colors duration-200 hover:text-gray-300"
                aria-label="Profile"
              >
                <User size={20} weight="regular" />
              </button>
            )}

            {/* Mobile Menu Button - Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white transition-colors duration-200 hover:text-gray-300"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`w-6 h-0.5 bg-white transition-all duration-200 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-white transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-white transition-all duration-200 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Dropdown from Header */}
      <div
        className={`fixed left-0 right-0 md:hidden ${glassClasses} border-t border-white/10 shadow-xl transition-all duration-300 z-40 ${
          isOpen
            ? 'top-[52px] opacity-100 visible'
            : 'top-[52px] opacity-0 invisible'
        }`}
      >
        <div className="px-4 py-6 text-center">
          {/* Navigation Links */}
          <nav className="space-y-4 mb-6">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className="font-nav block text-lg text-white/90 transition-colors hover:text-white py-2 font-normal tracking-wide"
              >
                {label}
              </Link>
            ))}
          </nav>


          {/* User Profile Section */}
          {user ? (
            <div className="mb-4">
              <div className="mb-4 p-4 bg-white/10 rounded-lg">
                <div className="flex items-center justify-center gap-3 mb-2">
                  {customer?.avatar_url ? (
                    <img
                      src={customer.avatar_url}
                      alt={customer.first_name || 'Profile'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {customer?.first_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-ui text-white text-sm font-medium">
                      {customer?.first_name && customer?.last_name
                        ? `${customer.first_name} ${customer.last_name}`
                        : user.email?.split('@')[0]
                      }
                    </p>
                  </div>
                </div>
                {customer && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-ui text-xs text-gray-300 font-light">Profile Complete</span>
                    <span className="font-ui text-xs font-semibold text-blue-300">
                      {customer.profile_completion_percentage || 0}%
                    </span>
                  </div>
                )}
              </div>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="font-button block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full transition-all duration-200 mb-3"
              >
                View Profile
              </Link>
              <Link
                to="/my-bookings"
                onClick={() => setIsOpen(false)}
                className="font-button block w-full text-center bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-full transition-all duration-200"
              >
                My Bookings
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsOpen(false);
                }}
                className="font-button block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full transition-all duration-200"
              >
                Sign In
              </button>
              <a
                href="https://vendor.trippechalo.in"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="font-button block w-full text-center bg-[#1E63EF] hover:bg-[#1750CC] text-white font-medium px-6 py-3 rounded-full transition-all duration-200"
              >
                Become a Vendor
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}


      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

    </nav>
  );
};

export default Navbar;

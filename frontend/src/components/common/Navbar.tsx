import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchOverlay from '../SearchOverlay';
import LoginModal from '../LoginModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchIcon, setShowSearchIcon] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // Navigation data
  const allNavLinks = [
    { path: '/', label: 'HOME' },
    { path: '/article', label: 'ARTICLE' },
    { path: '/about-us', label: 'ABOUT US' },
    { path: '/sherpa-ai', label: 'SHERPA AI' },
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
      
      // Show search icon when scrolled past hero section on landing page
      if (isLandingPage) {
        const heroHeight = window.innerHeight * 0.94; // 94vh from SearchScreen
        setShowSearchIcon(window.scrollY > heroHeight - 100);
      } else {
        setShowSearchIcon(true); // Always show on other pages
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLandingPage]);

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
      className={`font-tpc fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'md:py-2 md:px-4' : 'md:py-7 md:px-4'
      }`}
    >
      {/* Desktop Header */}
      <div
        className={`mx-auto max-w-7xl rounded-full px-6 py-4 ${glassClasses} shadow-[0_4px_25px_rgba(0,0,0,0.25)] hidden md:block`}
      >
        <div className="flex items-center justify-between">
          {/* Left Section - Navigation Links */}
          <div className="flex items-center space-x-8">
            {navLinks.filter(link => link.path !== '/').map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="text-sm text-white transition-colors duration-200 hover:text-gray-300 lg:text-base font-medium"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Center Section - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-[url('/src/assets/LogoImage.jpg')] bg-contain bg-no-repeat"></div>
              <div className="-ml-1 h-8 w-32 bg-[url('/src/assets/LogoWritten.jpg')] bg-contain bg-no-repeat"></div>
            </Link>
          </div>

          {/* Right Section - Profile & Vendor Button */}
          <div className="flex items-center space-x-4">
            {/* Profile Icon */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-white transition-colors duration-200 hover:text-gray-300"
              aria-label="Profile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Become a Vendor Button */}
            <a 
              href="https://tpc-vendor-in-dev.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#1E63EF] hover:bg-[#1750CC] text-white font-semibold px-4 py-1.5 text-sm rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Become a Vendor
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className={`${glassClasses} py-3 md:hidden w-full`}>
        <div className="flex items-center justify-between px-4">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 bg-[url('/src/assets/LogoImage.jpg')] bg-contain bg-no-repeat"></div>
            <div className="-ml-1 h-8 w-32 bg-[url('/src/assets/LogoWritten.jpg')] bg-contain bg-no-repeat"></div>
          </Link>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-1">
            {/* Mobile Profile */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="p-2 text-white transition-colors duration-200 hover:text-gray-300"
              aria-label="Profile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-[#1E63EF] hover:bg-[#1750CC] text-white font-bold px-3.5 py-0.5 text-2xl rounded-full transition-all duration-200 transform hover:scale-105"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? '✕' : '+'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slide from Right */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[80vw] md:hidden ${glassClasses} transform shadow-xl transition-all duration-300 z-50 ${
          isOpen
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Close Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-4 mb-8">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className="block text-lg text-white transition-colors hover:text-gray-300 py-2"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Become a Vendor Button */}
          <a 
            href="https://tpc-vendor-in-dev.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center bg-[#1E63EF] hover:bg-[#1750CC] text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 mb-6"
          >
            Become a Vendor
          </a>

          {/* Mobile Search Icon */}
          {showSearchIcon && (
            <button
              onClick={() => {
                setIsSearchOverlayOpen(true);
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-center rounded-md px-3 py-3 text-white transition-colors hover:bg-white/10 hover:text-gray-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Search Button */}
      <div
        className={`fixed left-1/2 transform -translate-x-1/2 z-40 transition-all duration-500 ${
          showSearchIcon 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{
          top: isScrolled ? '72px' : '104px' // Adjust based on navbar height: scrolled (16px + 56px) vs unscrolled (28px + 76px)
        }}
      >
        <button
          onClick={() => setIsSearchOverlayOpen(true)}
          className="bg-gradient-to-r from-black/60 to-gray-800/60 backdrop-blur-md hover:from-black/70 hover:to-gray-800/70 text-white hover:text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      
      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOverlayOpen} 
        onClose={() => setIsSearchOverlayOpen(false)} 
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;

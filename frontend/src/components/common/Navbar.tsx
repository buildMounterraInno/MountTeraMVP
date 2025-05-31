import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Navigation data
  const navLinks = [
    { path: '/events', label: 'EVENTS' },
    { path: '/article', label: 'ARTICLE' },
    { path: '/about-us', label: 'ABOUT US' },
    { path: '/sherpa-ai', label: 'SHERPA AI' },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
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

  // Glass morphism
  const glassClasses = 'bg-gradient-to-r from-white/25 to-gray-400/25 backdrop-blur-md';
  
  return (
    <nav className={`font-tpc fixed top-0 z-50 w-full px-4 transition-all duration-300 ${
      isScrolled ? 'py-2' : 'py-4'
    }`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-[10px] px-4 sm:px-6 py-2 ${glassClasses} transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : 'shadow-[0_4px_25px_rgba(0,0,0,0.25)]'
      }`}>
        {/* Logo Section*/}
        <div className="flex items-center">
          <div className="h-8 w-8 bg-[url('/src/assets/LogoImage.jpg')] bg-contain bg-no-repeat"></div>
          <div className="-ml-1 h-8 w-32 bg-[url('/src/assets/LogoWritten.jpg')] bg-contain bg-no-repeat"></div>
        </div>

        {/* Mobile Menu */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-1 text-white transition-transform duration-200 hover:scale-110"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
          {navLinks.map(({ path, label }) => (
            <Link 
              key={path} 
              to={path}
              className="text-sm lg:text-base text-white transition-colors duration-200 hover:text-gray-300"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Login Button */}
          <Link to="/login">
            <button className="rounded-full border border-white/50 bg-gray-800/50 px-3 sm:px-4 py-1.5 text-sm sm:text-base text-white transition-all duration-200 hover:bg-gray-700/50 hover:scale-105 hover:border-white">
              LOGIN
            </button>
          </Link>

          {/* Flag */}
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-800/50 bg-[url('/src/assets/flags/IndiaFlag.jpg')] bg-cover bg-center bg-no-repeat transition-transform duration-200 hover:scale-110 cursor-pointer"></div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-4 right-4 mt-2 rounded-lg ${glassClasses} shadow-lg transform transition-all duration-300 origin-top ${
          isOpen 
            ? 'scale-y-100 opacity-100' 
            : 'scale-y-0 opacity-0 pointer-events-none'
        }`}
      >
        <nav className="p-4 space-y-1">
          {navLinks.map(({ path, label }) => (
            <Link 
              key={path} 
              to={path} 
              onClick={() => setIsOpen(false)}
              className="block py-3 text-white transition-colors hover:text-gray-300 hover:bg-white/10 rounded-md px-3"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
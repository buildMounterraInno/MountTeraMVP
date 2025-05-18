import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // State to toggle mobile menu
  const [isOpen, setIsOpen] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="font-tpc fixed top-0 z-50 w-full p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[9.59px] bg-linear-to-r from-[#FFFFFF]/25 to-[#999999]/25 px-6 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.25)] backdrop-blur-md">
        {/* Logo section */}
        <div className="flex items-center">
          <div className="h-8 w-8 bg-[url('/src/assets/LogoImage.jpg')] bg-contain bg-no-repeat"></div>
          <div className="-ml-1 h-8 w-32 bg-[url('/src/assets/LogoWritten.jpg')] bg-contain bg-no-repeat"></div>
        </div>

        {/* Navigation links for desktop */}
        <div className="hidden items-center space-x-10 md:flex">
          <Link to="/events">
            <span className="text-white transition-colors hover:text-gray-300">
              EVENTS
            </span>
          </Link>
          <Link to="/article">
            <span className="text-white transition-colors hover:text-gray-300">
              ARTICLE
            </span>
          </Link>
          <Link to="/about-us">
            <span className="text-white transition-colors hover:text-gray-300">
              ABOUT US
            </span>
          </Link>
          <Link to="/sherpa-ai">
            <span className="text-white transition-colors hover:text-gray-300">
              SHERPA AI
            </span>
          </Link>
        </div>

        {/* Mobile hamburger menu */}
        <div className="flex items-center space-x-4 md:hidden">
          <button onClick={toggleMenu} className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full flex-col space-y-4 rounded-[9.59px] bg-linear-to-r from-[#FFFFFF]/25 to-[#999999]/25 p-4 text-white md:hidden">
            <Link to="/events" className="flex">
              <span className="pb-2 hover:text-gray-300">EVENTS</span>
            </Link>
            <Link to="/article" className="flex">
              <span className="pb-2 hover:text-gray-300">ARTICLE</span>
            </Link>
            <Link to="/about-us" className="flex">
              <span className="pb-2 hover:text-gray-300">ABOUT US</span>
            </Link>
            <Link to="/sherpa-ai" className="flex">
              <span className="hover:text-gray-300">SHERPA AI</span>
            </Link>
          </div>
        )}

        {/* Right-side elements */}
        <div className="flex items-center space-x-4">
          {/* Login button */}
          <Link to="/login">
            <button className="rounded-full border-[1px] border-white bg-gray-800/50 px-4 py-1 text-white transition-colors hover:bg-gray-700/50">
              LOGIN
            </button>
          </Link>

          {/* Flag icon */}
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-800/50 bg-[url('/src/assets/flags/IndiaFlag.jpg')] bg-cover bg-center bg-no-repeat"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

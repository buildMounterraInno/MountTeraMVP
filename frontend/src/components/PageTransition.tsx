import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Start loading animation on route change
    setIsLoading(true);
    
    // Complete loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Loading overlay that sweeps from left to right */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-black via-gray-800 to-black z-50 transition-transform duration-800 ease-in-out ${
          isLoading 
            ? 'transform translate-x-0' 
            : 'transform translate-x-full'
        }`}
        style={{
          width: '120%',
          left: '-20%'
        }}
      />
      
      {/* Page content */}
      <div 
        className={`w-full min-h-screen transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        key={location.pathname}
      >
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
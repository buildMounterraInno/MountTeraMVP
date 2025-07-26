import { useEffect, useState } from 'react';

const FloatingBlob = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-96 flex items-center justify-center overflow-hidden">
      {/* Main Blob */}
      <div
        className={`relative w-72 h-72 rounded-full transition-all duration-1000 ease-in-out ${
          isHovered ? 'scale-110' : 'scale-100'
        }`}
        style={{
          background: `conic-gradient(from ${mousePosition.x * 0.5}deg, 
            #667eea 0deg, 
            #764ba2 60deg, 
            #f093fb 120deg, 
            #f5576c 180deg, 
            #4facfe 240deg, 
            #00f2fe 300deg, 
            #667eea 360deg)`,
          filter: 'blur(1px)',
          animation: 'float 6s ease-in-out infinite',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Inner glow */}
        <div 
          className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-sm"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
          }}
        />
        
        {/* AI Symbol in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-6xl font-bold drop-shadow-lg">
            🤖
          </div>
        </div>
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-white/30 backdrop-blur-sm"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
            animation: `particle-float-${i + 1} ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

    </div>
  );
};

export default FloatingBlob;
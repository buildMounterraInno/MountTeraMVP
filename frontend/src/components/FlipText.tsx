import { useState, useEffect } from 'react';

interface FlipTextProps {
  searchType: 'events-experiences' | 'adventures';
  className?: string;
}


// all copied from internet, no credits to me - i dont know how its working, dont ask me
const FlipText: React.FC<FlipTextProps> = ({ searchType, className = '' }) => {
  const [currentText, setCurrentText] = useState(searchType === 'adventures' ? 'Adventure' : 'Experience');
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const newText = searchType === 'adventures' ? 'Adventure' : 'Experience';
    
    if (newText !== currentText) {
      setIsFlipping(true);
      
      setTimeout(() => {
        setCurrentText(newText);
        setIsFlipping(false);
      }, 250);
    }
  }, [searchType, currentText]);

  return (
    <span 
      className={`inline-block transition-transform duration-300 ease-in-out ${className}`}
      style={{
        transform: isFlipping ? 'translateY(20px) rotateX(-90deg)' : 'translateY(0px) rotateX(0deg)',
        transformOrigin: 'center bottom',
      }}
    >
      {currentText}
    </span>
  );
};

export default FlipText;
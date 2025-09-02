import React, { useRef } from 'react';

interface CardCarouselProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const CardCarousel: React.FC<CardCarouselProps> = ({ children, title, subtitle }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 408; // Width of card + gap (384px + 24px gap)
      const currentScroll = scrollRef.current.scrollLeft;
      const newScrollPosition = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="rounded-lg bg-white p-6 shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {title}
            </h2>
            <p className="text-gray-600 mt-1 italic">{subtitle}</p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 bg-white hover:bg-gray-50 rounded-full shadow-md transition-colors"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 bg-white hover:bg-gray-50 rounded-full shadow-md transition-colors"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Cards Container */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 pt-4 px-4"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none'
        } as React.CSSProperties}
      >
        {children}
      </div>
    </section>
  );
};

export default CardCarousel;
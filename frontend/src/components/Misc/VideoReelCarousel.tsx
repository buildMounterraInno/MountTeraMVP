import React, { useRef, useState, useEffect } from 'react';
import VideoReel from './VideoReel';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface VideoReelData {
  videoPath: string;
  title?: string;
}

interface VideoReelCarouselProps {
  reels: VideoReelData[];
}

const VideoReelCarousel: React.FC<VideoReelCarouselProps> = ({ reels }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [reelWidth, setReelWidth] = useState(0);
  const visibleCount = 6;

  useEffect(() => {
    const calculateWidth = () => {
      if (scrollContainerRef.current) {
        const child = scrollContainerRef.current.children[0] as HTMLElement;
        const width = child.getBoundingClientRect().width + 16;
        setReelWidth(width);
      }
    };
    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -reelWidth : reelWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <div className="flex items-center gap-2">
        <button
          onClick={() => scroll('left')}
          className="flex-shrink-0 rounded-full bg-white/90 p-2.5 shadow-md transition-all hover:bg-white"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
        </button>

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto py-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth',
            width: '100%',
          }}
        >
          {reels.map((reel, index) => (
            <div
              key={`${reel.videoPath}-${index}`}
              className="flex-shrink-0 snap-start"
            >
              <VideoReel {...reel} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="flex-shrink-0 rounded-full bg-white/90 p-2.5 shadow-md transition-all hover:bg-white"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-800" />
        </button>
      </div>
    </div>
  );
};

export default VideoReelCarousel;

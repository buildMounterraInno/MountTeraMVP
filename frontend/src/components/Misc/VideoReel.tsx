import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

interface VideoReelProps {
  videoPath: string;
  title?: string;
}

const VideoReel: React.FC<VideoReelProps> = ({ videoPath, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative h-[450px] w-[250px] overflow-hidden rounded-2xl bg-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]">
      <ReactPlayer
        url={videoPath}
        width="100%"
        height="100%"
        playing={isPlaying}
        loop
        muted={false}
        playsinline
        controls={false}
        style={{ objectFit: 'cover' }}
      />

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-black/50 p-2.5 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <PauseIcon className="h-7 w-7 text-white" />
        ) : (
          <PlayIcon className="h-7 w-7 text-white" />
        )}
      </button>

      {/* Title Overlay */}
      {title && (
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
          <p className="font-medium text-white drop-shadow-sm">{title}</p>
        </div>
      )}
    </div>
  );
};

export default VideoReel;

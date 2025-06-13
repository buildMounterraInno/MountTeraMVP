import VideoReelCarousel from './Misc/VideoReelCarousel';

// Sample video reels data - replace with your actual video paths
const sampleReels = [
  { videoPath: '/videos/reel1.mp4', title: 'Mountain Adventure' },
  { videoPath: '/videos/reel1.mp4', title: 'Beach Sunset' },
  { videoPath: '/videos/reel1.mp4', title: 'City Exploration' },
  { videoPath: '/videos/reel1.mp4', title: 'Forest Trek' },
  { videoPath: '/videos/reel1.mp4', title: 'Desert Safari' },
  { videoPath: '/videos/reel1.mp4', title: 'Waterfall Visit' },
];

const Misc = () => {
  return (
    <section className="relative flex flex-col gap-6 bg-[#F2F2F2] px-4 py-8 sm:px-8">
      {/* Title */}
      <h2 className="font-tpc text-2xl font-semibold text-[#FD5700] sm:text-3xl">
        Ready for your next journey?
      </h2>

      {/* Phrase */}
      <p className="font-tpc text-lg sm:text-xl">
        Tag us <span className="font-bold">@TripPeChaloge</span> and use
        <span className="font-bold"> #OutSocial</span> and you might just get
        featured!
      </p>

      {/* Video Reels Carousel */}
      <div className="w-full">
        <VideoReelCarousel reels={sampleReels} />
      </div>
    </section>
  );
};

export default Misc;

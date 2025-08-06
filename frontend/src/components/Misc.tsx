import VideoReelCarousel from './Misc/VideoReelCarousel';

// YouTube Shorts data for video reels
const sampleReels = [
  { videoPath: 'https://www.youtube.com/shorts/CJBQKUq9DtQ', title: 'Adventure Awaits' },
  { videoPath: 'https://www.youtube.com/shorts/_5g8pgVCcc8', title: 'Mountain Expedition' },
  { videoPath: 'https://www.youtube.com/shorts/T_OQ3izl1xo', title: 'Trek Journey' },
  { videoPath: 'https://www.youtube.com/shorts/LquENe14iaA', title: 'Nature Explorer' },
  { videoPath: 'https://www.youtube.com/shorts/Wx5xO8M0z6E', title: 'Wild Experience' },
  { videoPath: 'https://www.youtube.com/shorts/AfX8dwp_t6A', title: 'Epic Adventures' },
  
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

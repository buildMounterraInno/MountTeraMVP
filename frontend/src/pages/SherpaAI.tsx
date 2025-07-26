import backgroundImage from '../assets/Background.jpg';


// To be kept as static page for now lol
const SherpaAI = () => {
  return (
    <main className="relative min-h-screen w-full overflow-visible">
      {/* Background with overlay - Same as landing page */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8" style={{ paddingTop: '100px' }}>
        <div className="w-full max-w-4xl text-center">
          
          {/* Main Heading */}
          <h1 className="font-tpc mb-4 text-4xl leading-tight font-semibold text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
            Sherpa AI is almost here.
          </h1>
          
          {/* Description */}
          <div className="mb-8 max-w-3xl mx-auto">
            <p className="font-tpc text-base text-white drop-shadow-lg sm:text-lg sm:text-lg md:text-xl leading-relaxed">
              Imagine an assistant who knows every trek, every guide, every hidden gem and tailors it just for you. 
              Whether you're chasing Himalayan peaks or secret forest trails, Sherpa AI will help you explore with 
              intelligence, clarity, and confidence.
            </p>
          </div>

          {/* Launch Message */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center bg-black/40 backdrop-blur-lg border border-white/20 rounded-full px-8 py-4 shadow-xl mb-4">
              <p className="font-tpc text-lg md:text-xl font-semibold text-white drop-shadow-lg">
                Launching soon on Trip Pe Chalo
              </p>
            </div>
            
            <p className="font-tpc text-white text-base md:text-lg drop-shadow-md">
              The future of travel discovery is just around the corner.
            </p>
          </div>

          {/* Coming Soon Badge */}
          <div className="mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/25 backdrop-blur-lg border border-white/40 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-tpc font-semibold">COMING SOON</span>
            </div>
          </div>

          {/* Newsletter Signup - Landing page style */}
          <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto mb-16">
            <h3 className="font-tpc text-xl font-semibold text-white mb-4 drop-shadow-lg">
              Be the first to experience Sherpa AI
            </h3>
            <p className="font-tpc text-white/80 mb-6 drop-shadow-md">
              Get notified when we launch and receive exclusive early access to your personal travel assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
              />
              <button className="px-8 py-3 bg-white/25 backdrop-blur-lg border border-white/40 text-white font-semibold rounded-xl hover:bg-white/30 hover:shadow-lg transition-all duration-300 hover:scale-105 font-tpc">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SherpaAI;
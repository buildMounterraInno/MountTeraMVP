import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed import for articleHeroImage as we're using video instead
import { getFeaturedArticles } from '../lib/articles';
import { Article } from '../lib/supabase';

const Articles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const articlesData = await getFeaturedArticles(3);
        setArticles(articlesData);
      } catch (err) {
        setError('Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = (articleSlug: string) => {
    // Navigate to individual article page
    navigate(`/article/${articleSlug}`);
  };

  return (
    <>
      {/* CSS for Article Heading Underline Animation */}
      <style>{`
        .article-heading {
          text-decoration: none !important;
          position: relative;
          display: inline;
          background-image: linear-gradient(#1E63EF, #1E63EF);
          background-size: 0% 2px;
          background-repeat: no-repeat;
          background-position: left bottom;
          transition: background-size 0.3s ease-in-out;
          padding-bottom: 4px;
        }
        
        .group:hover .article-heading {
          background-size: 100% 2px;
        }

        /* Scrolling Text Marquee Animations */
        .scrolling-text {
          overflow: hidden;
          white-space: nowrap;
          padding: 20px 0;
        }

        .scroll-left {
          animation: scrollLeft 60s linear infinite;
        }

        .scroll-right {
          animation: scrollRight 60s linear infinite;
        }

        @keyframes scrollLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }

        @keyframes scrollRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
      
      <main className="relative w-full overflow-visible">
     
     
        {/* Hero Section */}
      <section className="relative h-screen w-full">
        {/* Hero Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/article_page.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Hero Text Overlay */}
        <div className="relative z-10 flex h-full items-end">
          <div className="w-full max-w-none px-8 pb-32 lg:pl-20 lg:pb-20 md:pl-16 md:pb-24 sm:px-8 sm:pb-16">
            <div className="max-w-[60%] lg:max-w-[65%] md:max-w-[75%] sm:max-w-full sm:text-center md:text-left">
              {/* Primary Heading */}
              <h1 
                className="font-hero text-white font-bold leading-[1.2] mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]
                           text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}
              >
                Go Beyond the Map. Discover the Story.
              </h1>
              
              {/* Subheading */}
              <p 
                className="font-body text-white font-medium leading-[1.4] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]
                           text-sm sm:text-base md:text-lg lg:text-xl"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}
              >
                Explore hidden trails, local cultures, and bold terrains. Curated for wanderers, not tourists.
              </p>
            </div>
          </div>
        </div>
        </section>
      

      {/* Recent Articles Section */}
      <section className="py-20 bg-[#f5f5eb]">
        <div className="max-w-7xl mx-auto px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 
              className="font-heading text-gray-900 font-medium uppercase text-3xl md:text-4xl"
              style={{ letterSpacing: '2px' }}
            >
              From Our Journey Logs
            </h2>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {loading ? (
              // Loading State
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-6"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </>
            ) : error ? (
              // Error State
              <div className="col-span-full text-center py-16">
                <p className="text-gray-900 text-lg mb-4">Failed to load articles</p>
                <p className="text-gray-600">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="font-button mt-4 px-6 py-2 bg-[#f5f5eb] text-gray-900 rounded-lg hover:bg-[#f5f5eb]/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : articles.length === 0 ? (
              // Empty State
              <div className="col-span-full text-center py-16">
                <p className="text-gray-900 text-lg mb-4">No articles found</p>
                <p className="text-gray-600">Check back later for new content!</p>
              </div>
            ) : (
              // Articles from Database
              articles.map((article) => (
                <article 
                  key={article.slug}
                  className="group cursor-pointer"
                  onClick={() => handleArticleClick(article.slug)}
                >
                  {/* Square Image Container with Red Bar Animation */}
                  <div className="aspect-square overflow-hidden rounded-lg mb-6 bg-gray-700 relative">
                    <img 
                      src={article.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&crop=center'}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:translate-y-1"
                      onError={(e) => {
                        // Fallback image if article image fails to load
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&crop=center';
                      }}
                    />
                    
                    {/* Blue Bar Animation */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#1E63EF] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  </div>
                  
                  {/* Article Heading with Underline Animation */}
                  <h3 className="font-card-title text-gray-900 text-xl font-semibold leading-tight relative article-heading">
                    {article.title}
                  </h3>
                  
                  {/* Article Excerpt - Optional */}
                  {article.excerpt && (
                    <p className="font-body text-gray-600 text-sm mt-2 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
        </section>
        

      {/* Horizontal Scrolling Text Marquee Section */}
      <section className="w-full bg-[#f5f5eb] py-8">
        {/* Strip 1 - Left to Right */}
        <div className="scrolling-text">
          <div className="scroll-left font-bold uppercase text-gray-800 text-4xl md:text-6xl font-display tracking-[2px] font-black">
            HIGH ALTITUDE / BASECAMP LIVING / ROCKY TERRAIN / ADVENTURE SPORTS / MOUNTAIN SURVIVAL / EPIC JOURNEYS / HIGH ALTITUDE / BASECAMP LIVING / ROCKY TERRAIN / ADVENTURE SPORTS / MOUNTAIN SURVIVAL / EPIC JOURNEYS / HIGH ALTITUDE / BASECAMP LIVING / ROCKY TERRAIN / ADVENTURE SPORTS / MOUNTAIN SURVIVAL / EPIC JOURNEYS / HIGH ALTITUDE / BASECAMP LIVING / ROCKY TERRAIN / ADVENTURE SPORTS / MOUNTAIN SURVIVAL / EPIC JOURNEYS
          </div>
        </div>

        {/* Vertical Spacing */}
        <div className="h-4"></div>

        {/* Strip 2 - Right to Left */}
        <div className="scrolling-text">
          <div className="scroll-right font-bold uppercase text-gray-800 text-4xl md:text-6xl font-display tracking-[2px] font-black">
            PEAK CLIMBING / BACKCOUNTRY HIKING / ADVENTURE GEAR / EXTREME OUTDOORS / MOUNTAIN RESCUE / TRAIL RUNNING / PEAK CLIMBING / BACKCOUNTRY HIKING / ADVENTURE GEAR / EXTREME OUTDOORS / MOUNTAIN RESCUE / TRAIL RUNNING / PEAK CLIMBING / BACKCOUNTRY HIKING / ADVENTURE GEAR / EXTREME OUTDOORS / MOUNTAIN RESCUE / TRAIL RUNNING / PEAK CLIMBING / BACKCOUNTRY HIKING / ADVENTURE GEAR / EXTREME OUTDOORS / MOUNTAIN RESCUE / TRAIL RUNNING
          </div>
        </div>
        </section>



      
      </main>
    </>
  );
};

export default Articles;
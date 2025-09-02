import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleBySlug } from '../lib/articles';
import { Article } from '../lib/supabase';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts or slug changes
    window.scrollTo(0, 0);
    
    const fetchArticle = async () => {
      if (!slug) {
        setError('Article not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const articleData = await getArticleBySlug(slug);
        
        if (!articleData) {
          setError('Article not found');
        } else {
          setArticle(articleData);
        }
      } catch (err) {
        setError(`Failed to fetch article: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading article...</p>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-gray-400 text-lg mb-8">{error || 'The article you are looking for does not exist.'}</p>
          <Link 
            to="/article" 
            className="font-button inline-block bg-[#f5f5eb] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#f5f5eb]/90 transition-colors"
          >
            Back to Articles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Section with Article Image */}
      <section className="relative h-96 w-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${article.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&crop=center'})` 
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Article Title Overlay */}
        <div className="relative z-10 flex h-full items-end">
          <div className="w-full max-w-4xl mx-auto px-8 pb-12">
            <div className="max-w-4xl text-center md:text-left">
              <h1 
                className="font-hero text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-4"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
              >
                {article.title}
              </h1>
              
              {article.excerpt && (
                <p 
                  className="font-body text-white/90 text-base sm:text-lg md:text-xl leading-relaxed"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}
                >
                  {article.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article Metadata */}
      <section className="bg-gray-800 py-6">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex flex-wrap items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="font-ui">By {article.author}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="font-ui">{new Date(article.published_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="font-ui capitalize">{article.category}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-[#f5f5eb]">
        <div className="max-w-4xl mx-auto px-8">
          <div className="prose prose-lg prose-gray max-w-none">
            <div 
              className="font-body text-gray-800 leading-relaxed"
              style={{
                fontSize: '18px',
                lineHeight: '1.8'
              }}
              dangerouslySetInnerHTML={{ 
                __html: article.content.replace(/\n/g, '<br />') 
              }}
            />
          </div>
        </div>
      </section>

      {/* Article Tags */}
      {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
        <section className="py-8 bg-gray-100">
          <div className="max-w-4xl mx-auto px-8">
            <h3 className="font-heading text-gray-900 font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="font-ui bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Articles Button */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <Link 
            to="/article" 
            className="font-button inline-flex items-center gap-2 bg-[#f5f5eb] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#f5f5eb]/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Articles
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ArticlePage;
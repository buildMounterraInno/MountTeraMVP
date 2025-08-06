import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { fetchTestimonials, Testimonial } from '../lib/supabase';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        const data = await fetchTestimonials();
        setTestimonials(data);
      } catch (err) {
        console.error('Failed to load testimonials:', err);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 400; // Adjust this value as needed
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <section className="w-full bg-[#111111] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse text-white">Loading testimonials...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#111111] py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p 
            className="text-xl uppercase text-blue-400 mb-4 tracking-wider font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Real stories, real results
          </motion.p>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            What <span className="relative">
              adventurers
              <motion.svg
                className="absolute -bottom-1 left-0 w-full h-3"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
              >
                <motion.path
                  d="M5 8C25 2, 45 10, 65 6C85 2, 105 9, 125 5C145 1, 165 8, 185 6C190 5.5, 195 6, 200 6.5"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
                />
              </motion.svg>
            </span> & partners say
          </motion.h2>
        </div>

        {/* Testimonials Scroll Container */}
        <div className="relative px-12 md:px-16">
          {/* Navigation Buttons */}
          {testimonials.length > 3 && (
            <>
              <button
                onClick={() => scroll('left')}
                className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 bg-transparent border-2 border-white hover:bg-white/10 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Scroll left"
              >
                <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 bg-transparent border-2 border-white hover:bg-white/10 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Scroll right"
              >
                <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </>
          )}

          {/* Scrollable Testimonials */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {testimonials.length === 0 ? (
              <div className="w-full text-center py-20">
                <p className="text-white/60 text-lg md:text-xl">To be added</p>
              </div>
            ) : (
              testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-72 sm:w-80 min-h-fit p-6 flex flex-col"
              >
                {/* User Info */}
                <div className="flex items-center mb-4 flex-shrink-0">
                  <img
                    src={testimonial.avatar_url || `https://i.pravatar.cc/150?img=${index + 1}`}
                    alt={testimonial.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover mr-4 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white text-base sm:text-lg">{testimonial.name}</h3>
                    <p className="text-gray-400 text-sm sm:text-base">{testimonial.role}</p>
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-white/90 leading-6 font-normal flex-grow" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', lineHeight: '1.5' }}>
                  "{testimonial.testimonial}"
                </blockquote>

              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
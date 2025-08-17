import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { fetchTestimonials, Testimonial } from '../lib/supabase';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const AboutUs = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
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
    
    const scrollAmount = 400;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#0f0f0f]"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-96 h-96 rounded-full opacity-5"
              style={{
                background: `radial-gradient(circle, var(--color-primary) 0%, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <motion.h1 
              className="font-tpc text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              Our Mission:{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                To Unlock the Real India
              </span>
              <br />
              One Experience at a Time
            </motion.h1>
            
            <motion.p 
              className="font-tpc text-lg md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              We believe that the greatest stories aren't just seen; they're lived. In a country as vibrant and diverse as India, countless adventures are waiting just beyond our daily routines—a hidden waterfall, a local artisan's workshop, a trail that leads to a breathtaking sunrise.
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </motion.section>

      {/* Origin Story Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <motion.h2 
              variants={fadeInUp}
              className="font-tpc text-3xl md:text-5xl font-bold text-[#111111] mb-12"
            >
              Why We Started
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="font-tpc text-xl md:text-2xl text-gray-700 leading-relaxed"
            >
              Trip Pe Chalo was born from a simple, shared frustration: Why is it so hard to find and book authentic travel experiences in our own backyard?
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[#111111] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="font-tpc text-3xl md:text-5xl font-bold text-white mb-6">
              Stories That Stay With Us
            </h2>
            <p className="font-tpc text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              What makes a journey unforgettable isn't always the destination — it's the emotion you carry home.
            </p>
          </motion.div>

          {/* Story Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                quote: "I thought I was just signing up for a pottery class, but what I got was a slice of rural life. We sat in a dusty courtyard, sipping chai with the artist's family, while learning how they've shaped clay for generations. I left with more than a bowl — I left with a story.",
                author: "Meenal, Indore",
                image: "pottery"
              },
              {
                quote: "The hike was beautiful, but it was the silence that stayed with me. We reached the top just before sunset. No loud music, no phones — just stars and strangers-turned-friends. For the first time in months, I actually felt present.",
                author: "Tanmay, Pune",
                image: "stargazing"
              },
              {
                quote: "It wasn't a stage or a show. Just a circle of locals, singing their hearts out in a backyard. No ticket booth. No Instagram reels. Just soul. That night reminded me what raw, human connection feels like.",
                author: "Ayesha, Jodhpur",
                image: "folk"
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <blockquote className="text-white/90 text-lg leading-relaxed mb-6 italic">
                  "{story.quote}"
                </blockquote>
                <p className="text-blue-400 font-semibold">– {story.author}</p>
              </motion.div>
            ))}
          </div>

          {/* Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="font-tpc text-2xl md:text-3xl font-semibold text-white">
                These aren't just trips.
              </p>
              <p className="font-tpc text-lg md:text-xl text-white/80">
                They're reminders that India still holds quiet, meaningful, unscripted moments — if you know where to look.
              </p>
              <p className="font-tpc text-2xl md:text-3xl font-semibold text-blue-400">
                We're not just changing how people travel.
              </p>
              <p className="font-tpc text-lg md:text-xl text-white/80">
                We're helping them rediscover the beauty of being there — fully, slowly, honestly.
              </p>
              <p className="font-tpc text-xl md:text-2xl font-bold text-white italic">
                Because the real India was never meant to be scrolled through — it was meant to be lived.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="font-tpc text-3xl md:text-5xl font-bold text-[#111111] mb-8">
              Who We Are
            </h2>
            
            <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
              <p>
                We are a team of trekkers, techies, storytellers, and explorers based in the heart of India — Bhopal. We started Trip Pe Chalo because we're passionate about making the beauty and adventure of our country accessible to everyone.
              </p>
              
              <p>
                We've faced the same planning frustrations you have, and we're obsessed with building the solution we always wished we had.
              </p>
              
              <motion.div
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mt-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-semibold text-[#111111]">
                  We're not a giant, faceless corporation. We're a bootstrapped startup on a mission. When you reach out, you're talking to people who live and breathe travel.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-tpc text-3xl md:text-5xl font-bold text-white mb-8">
              Join Our Journey
            </h2>
            
            <div className="space-y-6 text-lg md:text-xl text-white/80 leading-relaxed mb-12">
              <p>
                For us, this is just the beginning. We invite you to be a part of our growing community. Whether you're looking for a thrilling Himalayan trek, a peaceful weekend getaway, or a creative workshop in your own city — your next great story is waiting.
              </p>
            </div>
            
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center">
                <p className="font-tpc text-2xl md:text-3xl font-bold text-white">
                  Stop scrolling. Start experiencing.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
    
    </main>
  );
};

export default AboutUs;
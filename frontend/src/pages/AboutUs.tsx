import { motion } from 'framer-motion';
import { Mountains, Coffee, Star, MusicNotes, Rocket } from 'phosphor-react';

const AboutUs = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <main className="bg-white">
      {/* Hero Section - TravelPerk inspired clean layout */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <h1 className="font-hero text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Our Mission:{' '}
                <span className="text-blue-600">
                  To Unlock the Real India
                </span>{' '}
                One Experience at a Time
              </h1>
              
              <p className="font-body text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                We believe that the greatest stories aren't just seen; they're lived. In a country as vibrant and diverse as India, countless adventures are waiting just beyond our daily routines—a hidden waterfall, a local artisan's workshop, a trail that leads to a breathtaking sunrise.
              </p>
              
              <div className="flex gap-4">
                <div className="bg-blue-50 px-6 py-3 rounded-full">
                  <span className="font-ui text-sm font-medium text-blue-700">Authentic Experiences</span>
                </div>
                <div className="bg-purple-50 px-6 py-3 rounded-full">
                  <span className="font-ui text-sm font-medium text-purple-700">Local Communities</span>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="mb-4 flex justify-center">
                      <Mountains size={64} weight="regular" />
                    </div>
                    <p className="font-ui text-lg">Real India Awaits</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-16 md:py-24 bg-gray-50">
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
              className="font-heading text-3xl md:text-5xl font-bold text-gray-900 mb-8"
            >
              Why We Started
            </motion.h2>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100"
            >
              <p className="font-body text-xl md:text-2xl text-gray-800 leading-relaxed">
                Trip Pe Chalo was born from a simple, shared frustration: Why is it so hard to find and book authentic travel experiences in our own backyard?
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section - TravelPerk style cards */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Stories That Stay With Us
            </h2>
            <p className="font-body text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              What makes a journey unforgettable isn't always the destination — it's the emotion you carry home.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I thought I was just signing up for a pottery class, but what I got was a slice of rural life. We sat in a dusty courtyard, sipping chai with the artist's family, while learning how they've shaped clay for generations. I left with more than a bowl — I left with a story.",
                author: "Meenal, Indore",
                icon: <Coffee size={32} weight="regular" />
              },
              {
                quote: "The hike was beautiful, but it was the silence that stayed with me. We reached the top just before sunset. No loud music, no phones — just stars and strangers-turned-friends. For the first time in months, I actually felt present.",
                author: "Tanmay, Pune",
                icon: <Star size={32} weight="regular" />
              },
              {
                quote: "It wasn't a stage or a show. Just a circle of locals, singing their hearts out in a backyard. No ticket booth. No Instagram reels. Just soul. That night reminded me what raw, human connection feels like.",
                author: "Ayesha, Jodhpur",
                icon: <MusicNotes size={32} weight="regular" />
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="mb-6 text-blue-600">{story.icon}</div>
                <blockquote className="font-body text-gray-700 text-lg leading-relaxed mb-6">
                  "{story.quote}"
                </blockquote>
                <p className="font-ui text-blue-600 font-semibold">– {story.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">
                These aren't just trips.
              </h2>
              <p className="font-body text-lg md:text-xl text-gray-300 leading-relaxed">
                They're reminders that India still holds quiet, meaningful, unscripted moments — if you know where to look.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10">
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-blue-400 mb-6">
                We're not just changing how people travel.
              </h3>
              <p className="font-body text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                We're helping them rediscover the beauty of being there — fully, slowly, honestly.
              </p>
              <p className="font-display text-xl md:text-2xl font-bold text-white italic">
                Because the real India was never meant to be scrolled through — it was meant to be lived.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-gray-900 mb-12">
              Who We Are
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-left">
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  We are a team of trekkers, techies, storytellers, and explorers based in the heart of India — Bhopal. We started Trip Pe Chalo because we're passionate about making the beauty and adventure of our country accessible to everyone.
                </p>
                
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  We've faced the same planning frustrations you have, and we're obsessed with building the solution we always wished we had.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="mb-4">
                  <Rocket size={32} weight="regular" className="text-blue-600" />
                </div>
                <p className="font-body text-gray-800 font-medium leading-relaxed">
                  We're not a giant, faceless corporation. We're a bootstrapped startup on a mission. When you reach out, you're talking to people who live and breathe travel.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-8">
              Join Our Journey
            </h2>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 mb-12">
              <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
                For us, this is just the beginning. We invite you to be a part of our growing community. Whether you're looking for a thrilling Himalayan trek, a peaceful weekend getaway, or a creative workshop in your own city — your next great story is waiting.
              </p>
            </div>
            
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-white rounded-2xl px-8 py-6 shadow-lg">
                <p className="font-display text-2xl md:text-3xl font-bold text-gray-900">
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
import { motion } from 'framer-motion';
import { InstagramLogo, TwitterLogo, FacebookLogo, LinkedinLogo, MapPin, Envelope, Phone } from 'phosphor-react';

const Footer = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="lg:col-span-2"
          >
            <div className="flex items-center mb-6">
              <div className="h-8 w-8 bg-[url('/src/assets/LogoImage.jpg')] bg-contain bg-no-repeat"></div>
              <div className="-ml-1 h-8 w-32 bg-[url('/src/assets/LogoWritten.jpg')] bg-contain bg-no-repeat"></div>
            </div>
            <p className="font-body text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
              Discover the real India through authentic experiences that create lasting memories and meaningful connections.
            </p>
            <div className="flex space-x-6">
              {[
                { icon: InstagramLogo, href: "#", label: "Instagram" },
                { icon: TwitterLogo, href: "#", label: "Twitter" },
                { icon: FacebookLogo, href: "#", label: "Facebook" },
                { icon: LinkedinLogo, href: "#", label: "LinkedIn" }
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110"
                  aria-label={label}
                >
                  <Icon size={24} weight="regular" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3 className="font-heading text-lg font-bold mb-6">Explore</h3>
            <ul className="space-y-4">
              {[
                { label: "Treks & Adventures", href: "/search?type=adventures" },
                { label: "Events & Experiences", href: "/search?type=events-experiences" },
                { label: "Articles", href: "/article" },
                { label: "About Us", href: "/about-us" }
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="font-ui text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3 className="font-heading text-lg font-bold mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} weight="regular" className="text-blue-400 mt-1 flex-shrink-0" />
                <span className="font-ui text-gray-300">Bhopal, Madhya Pradesh, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Envelope size={20} weight="regular" className="text-blue-400 flex-shrink-0" />
                <a href="mailto:hello@trippechalo.com" className="font-ui text-gray-300 hover:text-white transition-colors duration-200">
                  hello@trippechalo.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} weight="regular" className="text-blue-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="font-ui text-gray-300 hover:text-white transition-colors duration-200">
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="font-ui text-gray-400 text-center md:text-left">
              © 2024 Trip Pe Chalo. All rights reserved. Made with ❤️ in India.
            </p>
            <div className="flex gap-8">
              <a href="#" className="font-ui text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="font-ui text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Inspiring Quote Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.blockquote
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="font-display text-lg md:text-xl font-medium text-white italic"
          >
            "The world is a book and those who do not travel read only one page."
            <footer className="font-body text-white/80 text-sm mt-2 not-italic">
              — Augustine of Hippo
            </footer>
          </motion.blockquote>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
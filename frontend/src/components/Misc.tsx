import facebookIcon from '../assets/icons/socialMedia/facebook.svg';
import instagramIcon from '../assets/icons/socialMedia/instagram.svg';
import linkedInIcon from '../assets/icons/socialMedia/linkedin.svg';
import SocialProfiles from './Misc/SocialProfiles';

const socialLinks = [
  { icon: instagramIcon, alt: 'Instagram', href: '#' },
  { icon: facebookIcon, alt: 'Facebook', href: '#' },
  { icon: linkedInIcon, alt: 'LinkedIn', href: '#' },
];

const Misc = () => {
  return (
    <section className="relative flex flex-col gap-4 bg-[#F2F2F2] px-8 pb-6">
      {/* Title */}
      <h2 className="font-tpc text-2xl font-semibold text-[#FD5700] sm:text-3xl">
        Ready for your next journey ?
      </h2>

      {/* Phrase */}
      <p className="font-tpc text-lg sm:text-xl">
        Tag us <span className="font-bold">@TripPeChaloge</span> and use
        <span className="font-bold"> #OutSocial</span> and you might just get
        featured!
      </p>

      {/* Social Media Icons */}
      <div className="flex gap-4">
        {socialLinks.map(({ icon, alt, href }) => (
          <a
            key={alt}
            href={href}
            className="transition-transform hover:scale-110"
            aria-label={alt}
          >
            <img src={icon} alt={alt} className="h-6 w-6" />
          </a>
        ))}
      </div>

      {/* Featured Profiles */}
      <SocialProfiles />
    </section>
  );
};

export default Misc;

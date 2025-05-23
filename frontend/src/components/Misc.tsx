import facebookIcon from '../assets/icons/socialMedia/facebook.svg';
import instagramIcon from '../assets/icons/socialMedia/instagram.svg';
import linkedInIcon from '../assets/icons/socialMedia/linkedin.svg';

import SocialProfiles from './Misc/SocialProfiles';

const Misc = () => {
  return (
    <div className="relative flex flex-col gap-3 bg-[#F2F2F2] px-8 pb-6">
      {/* Title */}
      <div className="font-tpc text-2xl font-semibold text-[#FD5700] sm:text-3xl">
        Ready for your next journey ?
      </div>

      {/* Phrase */}
      <div className="font-tpc text-lg sm:text-xl">
        Tag us <span className="font-bold">@TripPeChaloge</span> and use
        <span className="font-bold"> #OutSocial</span> and you might just get
        featured!
      </div>

      {/* Social Media Icons */}
      <div className="flex gap-4">
        <img src={instagramIcon} alt="Instagram" className="h-6 w-6" />
        <img src={facebookIcon} alt="Facebook" className="h-6 w-6" />
        <img src={linkedInIcon} alt="LinkedIn" className="h-6 w-6" />
      </div>

      {/* Featured Profiles */}
      <SocialProfiles />
    </div>
  );
};

export default Misc;

import googlePlay from '../../assets/icons/StoreIcons/googlePlay.png';
import appStoreBlack from '../../assets/icons/StoreIcons/appStoreBlack.svg';
import footerDecal from '../../assets/FooterDecal.svg';

const Footer = () => {
  // Data arrays for cleaner code
  const socialLinks = [
    {
      name: 'Instagram',
      icon: 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
    },
    {
      name: 'Facebook',
      icon: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
    },
    {
      name: 'LinkedIn',
      icon: 'M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z',
    },
  ];

  const footerSections = [
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Gift Cards', 'Explorer'],
    },
    {
      title: 'Support',
      links: [
        'Contact',
        'Legal Notice',
        'Privacy Policy',
        'Terms and Conditions',
      ],
    },
  ];

  return (
    <footer className="font-tpc relative overflow-hidden bg-[#1E63FE] text-white">
      {/* Background Decal */}
      <div className="absolute top-0 right-0 h-80 opacity-50 md:opacity-100">
        <img src={footerDecal} alt="" className="h-full w-full object-cover" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:px-8">
        {/* Logo */}
        <div className="mb-12 flex items-center">
          <div className="h-8 w-8 bg-[url('/src/assets/LogoImage.jpg')] bg-contain bg-no-repeat" />
          <div className="-ml-1 h-8 w-32 bg-[url('/src/assets/LogoWritten.jpg')] bg-contain bg-no-repeat" />
        </div>

        {/* Main Content Grid - Modified for mobile side-by-side */}
        <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Social Media - Full width on mobile */}
          <div className="col-span-1 sm:col-span-1">
            <h3 className="mb-4 font-bold">Connect with us</h3>
            <div className="flex gap-4">
              {socialLinks.map(({ name, icon }) => (
                <a
                  key={name}
                  href="#"
                  className="transition-opacity hover:opacity-80"
                  aria-label={name}
                >
                  <svg
                    role="img"
                    viewBox={name === 'LinkedIn' ? '0 0 50 50' : '0 0 24 24'}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 fill-white"
                  >
                    <title>{name}</title>
                    <path d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Company & Support - Side by side on mobile */}
          <div className="col-span-1 grid grid-cols-2 gap-6 sm:col-span-1 sm:grid-cols-1 lg:col-span-2 lg:grid-cols-2">
            {footerSections.map(({ title, links }) => (
              <div key={title}>
                <h3 className="mb-4 font-bold">{title}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link} className="text-sm sm:text-base">
                      <a
                        href="#"
                        className="transition-colors hover:text-white/80"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* App Downloads */}
          <div className="col-span-1 sm:col-span-1">
            <h3 className="mb-4 font-bold">Meet us outdoors</h3>
            <div className="space-y-3">
              <a href="#" className="block">
                <img
                  src={googlePlay}
                  alt="Get it on Google Play"
                  className="h-10 w-auto"
                />
              </a>
              <a href="#" className="block">
                <img
                  src={appStoreBlack}
                  alt="Download on the App Store"
                  className="h-10 w-auto"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Trademark */}
        <div className="border-t border-white/20 pt-8 text-center md:text-left">
          <p className="text-sm">
            <span className="font-bold">ट्रिप पे चलो</span>
            <span className="mx-2">•</span>
            <span className="font-bold">TripPeChalo</span>
            <span className="mx-2">•</span>
            <span className="text-white/80">
              registered trademarks of Mounterra, LLC in India as well as
              certain other jurisdictions
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

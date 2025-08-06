import { useState, useEffect } from 'react';
import { treks } from '../../data/trek';
import SearchBar from '../../components/common/SearchBar';
import VideoReelCarousel from '../../components/Misc/VideoReelCarousel';

// Get the trek data
const trekData = treks.find(
  (trek) => trek.placeName === 'Valley of Flowers Trek'
);

const images = [
  trekData?.destinationImage ||
    'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
  'https://images.unsplash.com/photo-1496429862132-5ab36b6ae330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
];

const tabs = [
  'Overview',
  'Quick Facts',
  'How to Reach',
  'Trek Difficulty',
  'Safety Measures',
];

const vendors = [
  {
    id: 1,
    name: 'Valley Explorers',
    logo: 'VE',
    logoColor: 'bg-pink-100 text-pink-600',
    verified: true,
    rating: 4.9,
    reviewCount: 378,
    price: 9500,
    originalPrice: 12000,
    groupSize: '8-12 people',
    startDate: 'July 15, 2024',
    availableSlots: 6,
    inclusions: ['Meals', 'Accommodation', 'Guide', 'Permits'],
    additionalInclusions: 0,
    highlights: [
      { text: 'Photography Guide', color: 'bg-blue-100 text-blue-800' },
      { text: 'Flower Expert', color: 'bg-green-100 text-green-800' },
      { text: 'Small Groups', color: 'bg-purple-100 text-purple-800' },
    ],
  },
  {
    id: 2,
    name: 'Himalayan Botanica',
    logo: 'HB',
    logoColor: 'bg-green-100 text-green-600',
    verified: true,
    rating: 4.8,
    reviewCount: 245,
    price: 8500,
    originalPrice: null,
    groupSize: '10-15 people',
    startDate: 'July 20, 2024',
    availableSlots: 12,
    inclusions: ['Meals', 'Guesthouse', 'Guide', 'Transport'],
    additionalInclusions: 0,
    highlights: [
      { text: 'Botany Workshops', color: 'bg-green-100 text-green-800' },
      { text: 'Local Culture', color: 'bg-orange-100 text-orange-800' },
    ],
  },
  {
    id: 3,
    name: 'Alpine Adventures',
    logo: 'AA',
    logoColor: 'bg-purple-100 text-purple-600',
    verified: true,
    rating: 4.7,
    reviewCount: 189,
    price: 14500,
    originalPrice: 16000,
    groupSize: '6-10 people',
    startDate: 'July 10, 2024',
    availableSlots: 4,
    inclusions: ['Meals', 'Luxury Stay', 'Expert Guide', 'Transport'],
    additionalInclusions: 0,
    highlights: [
      { text: 'Premium Experience', color: 'bg-purple-100 text-purple-800' },
      { text: 'Photography Tour', color: 'bg-blue-100 text-blue-800' },
      { text: 'Exclusive Access', color: 'bg-red-100 text-red-800' },
    ],
  },
  {
    id: 4,
    name: 'Nature Trails',
    logo: 'NT',
    logoColor: 'bg-orange-100 text-orange-600',
    verified: false,
    rating: 4.5,
    reviewCount: 156,
    price: 7500,
    originalPrice: 9000,
    groupSize: '12-18 people',
    startDate: 'July 25, 2024',
    availableSlots: 15,
    inclusions: ['Meals', 'Basic Stay', 'Guide', 'Permits'],
    additionalInclusions: 0,
    highlights: [
      { text: 'Budget Friendly', color: 'bg-green-100 text-green-800' },
      { text: 'Flexible Dates', color: 'bg-blue-100 text-blue-800' },
    ],
  },
  {
    id: 5,
    name: 'Flower Valley Tours',
    logo: 'FV',
    logoColor: 'bg-red-100 text-red-600',
    verified: false,
    rating: 4.4,
    reviewCount: 92,
    price: 6800,
    originalPrice: null,
    groupSize: '15-20 people',
    startDate: 'August 5, 2024',
    availableSlots: 18,
    inclusions: ['Meals', 'Shared Stay', 'Guide'],
    additionalInclusions: 0,
    highlights: [
      { text: 'Most Affordable', color: 'bg-green-100 text-green-800' },
      { text: 'Group Discounts', color: 'bg-blue-100 text-blue-800' },
    ],
  },
];

const videoReels = [
  {
    videoPath: '/videos/reel1.mp4',
    title: 'Alpine Meadows',
  },
  {
    videoPath: '/videos/reel1.mp4',
    title: 'Rare Himalayan Flowers',
  },
  {
    videoPath: '/videos/reel1.mp4',
    title: 'Hemkund Sahib',
  },
  {
    videoPath: '/videos/reel1.mp4',
    title: 'Mountain Views',
  },
];

const ValleyOfFlowersTrek = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const quickFacts = [
    { label: 'Region', value: 'Uttarakhand, Chamoli', icon: '🗺️' },
    { label: 'Altitude', value: '11,500 ft / 3,505 m', icon: '📏' },
    { label: 'Duration', value: '6-7 Days', icon: '⏳' },
    { label: 'Season', value: 'July to September', icon: '🌤️' },
    { label: 'Difficulty', value: 'Easy to Moderate', icon: '⚠️' },
    { label: 'Trail Distance', value: '38 km approx.', icon: '🥾' },
    { label: 'Start/End Point', value: 'Govindghat', icon: '📍' },
    { label: 'Permit Required', value: 'Yes', icon: '📝' },
  ];

  const howToReach = [
    {
      mode: 'By Air',
      icon: '✈️',
      detail:
        'Nearest airport is Jolly Grant Airport, Dehradun (295 km). Taxis available to Govindghat.',
    },
    {
      mode: 'By Train',
      icon: '🚆',
      detail:
        'Rishikesh is the nearest railway station (276 km). Regular trains from Delhi.',
    },
    {
      mode: 'By Bus',
      icon: '🚌',
      detail:
        'Regular buses from Delhi/Rishikesh to Joshimath, then local transport to Govindghat.',
    },
    {
      mode: 'By Road',
      icon: '🚗',
      detail:
        'Well-connected road network from Delhi via Rishikesh and Joshimath to Govindghat.',
    },
  ];

  const whatToExpect = [
    'Vast meadows of alpine flowers',
    'UNESCO World Heritage Site',
    'Rich biodiversity and rare species',
    'Hemkund Sahib pilgrimage option',
    'Pristine Himalayan landscapes',
    'Local Garhwali culture',
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ));
  };

  const getAvailabilityColor = (slots: number) => {
    if (slots > 10) return 'text-green-600';
    if (slots > 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAvailabilityDotColor = (slots: number) => {
    if (slots > 10) return 'bg-green-500';
    if (slots > 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${images[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-100"></div>
      </div>

      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-8 pt-24 pb-12">
          {/* Search Bar Section */}
          <div className="mb-8">
            <SearchBar />
          </div>

          {/* Hero Section with white text */}
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="md:w-1/2">
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={images[0]}
                  alt="Valley of Flowers Trek"
                  className="h-96 w-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-3 md:w-1/2">
              <h1 className="text-4xl font-bold text-white">
                Valley of Flowers Trek
              </h1>
              <p className="text-gray-200">📍 Govindghat, Uttarakhand</p>
              <p className="text-sm text-gray-300">
                The Valley of Flowers Trek takes you through a UNESCO World
                Heritage site famous for its meadows of endemic alpine flowers
                and variety of flora. This moderate trek offers stunning views
                of colorful flowers against the backdrop of mighty Himalayas.
              </p>

              <div className="flex gap-4 text-sm text-gray-200">
                <p>🕒 6 Days</p>
                <p>⛰️ 11,500 ft</p>
                <p>📅 July to September</p>
              </div>

              <div>
                <span className="rounded-full bg-yellow-400/90 px-2.5 py-0.5 text-xs font-semibold text-yellow-900">
                  Moderate
                </span>
              </div>

              <div>
                <h2 className="mt-4 mb-1 font-semibold text-white">
                  Trek Highlights:
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Alpine Flowers',
                    'UNESCO Site',
                    'Hemkund Sahib',
                    'Valley Views',
                    'Biodiversity',
                    'Photography',
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-400/90 px-2 py-1 text-xs text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section with white background */}
          <div className="mt-10 rounded-xl bg-white p-4">
            <div className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 pb-2 text-sm font-medium ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4 text-gray-700">
              {activeTab === 'Overview' && (
                <div className="rounded-lg bg-white p-6">
                  <h3 className="text-xl font-semibold">About This Trek</h3>
                  <p className="mt-3 text-gray-600">
                    The Valley of Flowers National Park is a stunning natural
                    wonder nestled in the West Himalayan region. The valley
                    floor is a natural garden, home to over 500 species of wild
                    flowers, creating a vibrant carpet of colors during the
                    monsoon season.
                  </p>
                  <p className="mt-3 text-gray-600">
                    This trek combines natural beauty with spiritual
                    significance, as it's often combined with a visit to the
                    holy Hemkund Sahib Gurudwara. The valley is also home to
                    rare and endangered animals, including the Asiatic black
                    bear, snow leopard, and musk deer.
                  </p>
                  <h4 className="mt-4 font-semibold">What to Expect:</h4>
                  <ul className="mt-2 space-y-1">
                    {whatToExpect.map((item, i) => (
                      <li key={i} className="flex items-center text-gray-600">
                        ✅ {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'Quick Facts' && (
                <div className="rounded-lg bg-white p-6">
                  <h3 className="text-xl font-semibold">Quick Facts</h3>
                  <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {quickFacts.map((fact, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border bg-gray-50 p-4 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{fact.icon}</span>
                          <div>
                            <p className="text-sm text-gray-500">
                              {fact.label}
                            </p>
                            <p className="font-medium">{fact.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'How to Reach' && (
                <div className="rounded-lg bg-white p-6">
                  <h3 className="text-xl font-semibold">How to Reach</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {howToReach.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-md border-l-4 border-blue-500 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.mode}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              {item.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Trek Difficulty' && (
                <div className="rounded-lg bg-white p-6">
                  <h3 className="text-xl font-semibold">Trek Difficulty</h3>
                  <div className="mt-4 space-y-4 rounded-lg bg-gray-50 p-6 shadow-md">
                    <div>
                      <p className="font-medium text-gray-700">Trail Type:</p>
                      <p className="text-gray-600">
                        Well-maintained trails with some steep sections. Stone
                        steps in many areas.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Fitness Requirement:
                      </p>
                      <p className="text-gray-600">
                        Moderate fitness needed. Ability to walk 5-6 hours
                        daily.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Altitude Challenges:
                      </p>
                      <p className="text-gray-600">
                        Gradual ascent with proper acclimatization stops.
                        Hemkund visit requires additional preparation.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Best Suited For:
                      </p>
                      <p className="text-gray-600">
                        Nature enthusiasts, photographers, and spiritual
                        seekers. Good for fit beginners.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Safety Measures' && (
                <div className="rounded-lg bg-white p-6">
                  <h3 className="text-xl font-semibold">Safety Measures</h3>
                  <div className="mt-4 grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">
                        Monsoon Precautions
                      </h4>
                      <ul className="list-inside list-disc text-gray-600">
                        <li>Carry good quality rain gear</li>
                        <li>Use waterproof bags for electronics</li>
                        <li>Check weather updates regularly</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Essentials</h4>
                      <ul className="list-inside list-disc text-gray-600">
                        <li>Sturdy trekking shoes with good grip</li>
                        <li>Rain protection and quick-dry clothes</li>
                        <li>Basic first aid and personal medication</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Video Reels Section */}
          <div className="mt-10 rounded-xl bg-white p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Trek Videos</h2>
              <p className="mt-2 text-gray-600">
                Experience the Valley of Flowers Trek through these amazing
                video reels
              </p>
            </div>
            <VideoReelCarousel reels={videoReels} />
          </div>

          {/* Available Vendors Section */}
          <div className="mt-10 rounded-xl bg-white p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Packages (5 vendors)
              </h2>
              <p className="mt-2 text-gray-600">
                Choose from verified trekking companies offering Valley of
                Flowers packages
              </p>
            </div>

            <div className="space-y-6">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className={`h-12 w-12 ${vendor.logoColor} flex items-center justify-center rounded-lg`}
                        >
                          <span className="text-xl font-bold">
                            {vendor.logo}
                          </span>
                        </div>
                        <div>
                          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            {vendor.name}
                            {vendor.verified && (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                Verified
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {renderStars(vendor.rating)}
                            </div>
                            <span className="text-sm text-gray-600">
                              {vendor.rating} ({vendor.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-medium text-gray-700">
                            Inclusions:
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {vendor.inclusions.map((inclusion, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                {inclusion}
                              </li>
                            ))}
                            {vendor.additionalInclusions > 0 && (
                              <li className="text-xs text-blue-600">
                                +{vendor.additionalInclusions} more
                              </li>
                            )}
                          </ul>
                        </div>
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-gray-500">👥</span>
                            <span className="text-sm text-gray-600">
                              {vendor.groupSize}
                            </span>
                          </div>
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-gray-500">📅</span>
                            <span className="text-sm text-gray-600">
                              Starts {vendor.startDate}
                            </span>
                          </div>
                          <div className="mb-3 flex items-center gap-2">
                            <span
                              className={`h-2 w-2 ${getAvailabilityDotColor(vendor.availableSlots)} rounded-full`}
                            ></span>
                            <span
                              className={`text-sm ${getAvailabilityColor(vendor.availableSlots)}`}
                            >
                              {vendor.availableSlots} slots available
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {vendor.highlights.map((highlight, idx) => (
                              <span
                                key={idx}
                                className={`rounded-full ${highlight.color} px-2 py-1 text-xs`}
                              >
                                {highlight.text}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 lg:ml-6">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{vendor.price.toLocaleString()}
                          </span>
                          {vendor.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{vendor.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">
                          per person
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValleyOfFlowersTrek;

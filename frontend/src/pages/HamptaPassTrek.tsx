import { useState, useEffect } from 'react';
import { treks } from '../data/trek';
import SearchBar from '../components/common/SearchBar';

// Get the trek data
const trekData = treks.find((trek) => trek.placeName === 'Hampta Pass Trek');

const images = [
  trekData?.destinationImage ||
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=2940&q=80',
  'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=2940&q=80',
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
    name: 'Adventure Himalaya',
    logo: 'AH',
    logoColor: 'bg-green-100 text-green-600',
    verified: true,
    rating: 4.8,
    reviewCount: 245,
    price: 12500,
    originalPrice: 15000,
    groupSize: '8-15 people',
    startDate: 'June 15, 2024',
    availableSlots: 12,
    inclusions: ['Meals', 'Accommodation', 'Guide', 'Transport'],
    additionalInclusions: 0,
    highlights: [
      { text: 'Professional Photography', color: 'bg-blue-100 text-blue-800' },
      { text: 'Medical Kit', color: 'bg-green-100 text-green-800' },
      { text: 'Experienced Guides', color: 'bg-purple-100 text-purple-800' },
    ],
  },
  {
    id: 2,
    name: 'Trek Himalaya',
    logo: 'TH',
    logoColor: 'bg-blue-100 text-blue-600',
    verified: false,
    rating: 4.6,
    reviewCount: 132,
    price: 11000,
    originalPrice: null,
    groupSize: '10-20 people',
    startDate: 'June 20, 2024',
    availableSlots: 8,
    inclusions: ['Meals', 'Tents', 'Guide', 'Permits'],
    additionalInclusions: 0,
    highlights: [
      {
        text: 'Local Cultural Experience',
        color: 'bg-orange-100 text-orange-800',
      },
      { text: 'Budget Friendly', color: 'bg-green-100 text-green-800' },
    ],
  },
  {
    id: 3,
    name: 'Mountain Explorers',
    logo: 'ME',
    logoColor: 'bg-orange-100 text-orange-600',
    verified: true,
    rating: 4.9,
    reviewCount: 456,
    price: 18500,
    originalPrice: 22000,
    groupSize: '6-12 people',
    startDate: 'June 10, 2024',
    availableSlots: 5,
    inclusions: ['Meals', 'Luxury Tents', 'Guide', 'Transport'],
    additionalInclusions: 0,
    highlights: [
      { text: 'Luxury Camping', color: 'bg-purple-100 text-purple-800' },
      { text: 'Private Chef', color: 'bg-blue-100 text-blue-800' },
      { text: 'Emergency Evacuation', color: 'bg-red-100 text-red-800' },
      { text: 'Small Groups', color: 'bg-green-100 text-green-800' },
    ],
  },
  {
    id: 4,
    name: 'Himalayan Odyssey',
    logo: 'HO',
    logoColor: 'bg-purple-100 text-purple-600',
    verified: false,
    rating: 4.2,
    reviewCount: 89,
    price: 13800,
    originalPrice: null,
    groupSize: '12-25 people',
    startDate: 'June 25, 2024',
    availableSlots: 3,
    inclusions: ['Meals', 'Accommodation', 'Guide', 'Insurance'],
    additionalInclusions: 0,
    highlights: [
      { text: 'Eco-Friendly', color: 'bg-green-100 text-green-800' },
      { text: 'Photography Focus', color: 'bg-blue-100 text-blue-800' },
    ],
  },
  {
    id: 5,
    name: 'Peak Adventures',
    logo: 'PA',
    logoColor: 'bg-red-100 text-red-600',
    verified: false,
    rating: 4.3,
    reviewCount: 67,
    price: 9500,
    originalPrice: null,
    groupSize: '15-30 people',
    startDate: 'July 5, 2024',
    availableSlots: 15,
    inclusions: ['Meals', 'Basic Tents', 'Guide', 'Equipment'],
    additionalInclusions: 0,
    highlights: [
      { text: 'Basic Package', color: 'bg-green-100 text-green-800' },
      { text: 'Large Groups', color: 'bg-blue-100 text-blue-800' },
    ],
  },
];

const HamptaPassTrek = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const quickFacts = [
    { label: 'Region', value: 'Himachal Pradesh, Pir Panjal', icon: '🗺️' },
    { label: 'Altitude', value: '14,100 ft / 4,298 m', icon: '📏' },
    { label: 'Duration', value: '4–6 Days', icon: '⏳' },
    { label: 'Season', value: 'June to October', icon: '🌤️' },
    { label: 'Difficulty', value: 'Moderate', icon: '⚠️' },
    { label: 'Trail Distance', value: '35 km approx.', icon: '🥾' },
    { label: 'Start/End Point', value: 'Jobra to Chatru', icon: '📍' },
    { label: 'Permit Required', value: 'Yes', icon: '📝' },
  ];

  const howToReach = [
    {
      mode: 'By Air',
      icon: '✈️',
      detail:
        'Nearest airport is Bhuntar (Kullu), 50 km from Manali. Taxis and buses are available to reach Manali.',
    },
    {
      mode: 'By Train',
      icon: '🚆',
      detail:
        'Joginder Nagar is the closest narrow gauge station, but Chandigarh (310 km away) is more practical.',
    },
    {
      mode: 'By Bus',
      icon: '🚌',
      detail:
        'Volvo and HRTC buses run regularly from Delhi to Manali (~12–14 hours). Depart in the evening.',
    },
    {
      mode: 'By Road',
      icon: '🚗',
      detail:
        'NH3 connects Manali from Delhi. Roads are mostly good. 12–14 hours drive depending on traffic.',
    },
  ];

  const whatToExpect = [
    'Dramatic landscape changes from green valleys to barren mountains',
    'River crossings and rocky terrain',
    'Views of snow-capped peaks like Deo Tibba and Indrasan',
    'Wildlife spotting opportunities',
    'Photography of pristine alpine lakes',
    'Experience of high-altitude camping',
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
                  alt="Hampta Pass Trek"
                  className="h-96 w-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-3 md:w-1/2">
              <h1 className="text-4xl font-bold text-white">
                Hampta Pass Trek
              </h1>
              <p className="text-gray-200">📍 Manali, Himachal Pradesh</p>
              <p className="text-sm text-gray-300">
                The Hampta Pass Trek is a stunning crossover trek that connects
                the lush Kullu Valley to the barren Spiti region. Experience
                dramatic changes in landscape as you traverse through diverse
                terrains and beautiful meadows.
              </p>

              <div className="flex gap-4 text-sm text-gray-200">
                <p>🕒 5 Days</p>
                <p>⛰️ 14,100 ft</p>
                <p>📅 June to September</p>
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
                    'Crossover Trek',
                    'Chandratal Lake',
                    'Diverse Terrain',
                    'Mountain Views',
                    'Alpine Meadows',
                    'River Crossing',
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
                    The Hampta Pass trek is one of the most popular and
                    rewarding treks in Himachal Pradesh. This moderate-level
                    trek offers an incredible diversity of landscapes – from the
                    lush green valleys of Kullu to the stark, desert-like
                    terrain of Lahaul and Spiti.
                  </p>
                  <p className="mt-3 text-gray-600">
                    The trek crosses the Hampta Pass at 14,100 feet, offering
                    views of the Pir Panjal and Dhauladhar ranges. A highlight
                    is the Chandratal Lake, often called the 'Moon Lake' for its
                    crescent shape.
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
                        Forested paths, rocky crossings, snowy patches near the
                        pass.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Fitness Requirement:
                      </p>
                      <p className="text-gray-600">
                        Requires moderate endurance and stamina. Prep with
                        regular cardio and hikes.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Altitude Challenges:
                      </p>
                      <p className="text-gray-600">
                        Gradual gain with sudden push near pass (Hampta). Proper
                        acclimatization needed.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Best Suited For:
                      </p>
                      <p className="text-gray-600">
                        First-timers with preparation, intermediates looking for
                        Himalayan experience.
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
                        Acclimatization
                      </h4>
                      <ul className="list-inside list-disc text-gray-600">
                        <li>Spend a day in Manali to acclimatize.</li>
                        <li>Hydrate well and avoid overexertion early on.</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Essentials</h4>
                      <ul className="list-inside list-disc text-gray-600">
                        <li>
                          3-layer clothing system (thermal, fleece, shell)
                        </li>
                        <li>Good trekking shoes, waterproof jacket</li>
                        <li>Headlamp, first aid kit, water purification</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Available Vendors Section */}
          <div className="mt-10 rounded-xl bg-white p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Packages (5 vendors)
              </h2>
              <p className="mt-2 text-gray-600">
                Choose from verified trekking companies offering Hampta Pass
                packages
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
                        {/* <button className="rounded-lg border border-blue-200 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-50">
                          Details
                        </button> */}
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

export default HamptaPassTrek;

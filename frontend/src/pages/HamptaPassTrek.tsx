import { useState, useEffect } from 'react';

const images = [
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

      {/* Content */}
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-8 pt-24 pb-12">
          {/* Hero Section with white text */}
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="md:w-1/2">
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={images[0]}
                  alt="Hampta Pass"
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
                The Hampta Pass trek is one of the most popular and rewarding
                treks in Himachal Pradesh. This moderate-level trek offers an
                incredible diversity of landscapes – from the lush green valleys
                of Kullu to the stark, desert-like terrain of Lahaul and Spiti.
              </p>

              <div className="flex gap-4 text-sm text-gray-200">
                <p>🕒 4–6 Days</p>
                <p>⛰️ 14,100 ft</p>
                <p>📅 June to October</p>
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
                    'Chandratal Lake',
                    'Hampta Valley',
                    'Beas Kund',
                    'Chika Meadows',
                    'Pir Panjal Views',
                    'Desert Landscapes',
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
                  <p>
                    The Hampta Pass trek is one of the most popular and
                    rewarding treks in Himachal Pradesh. This moderate-level
                    trek offers an incredible diversity of landscapes – from the
                    lush green valleys of Kullu to the stark, desert-like
                    terrain of Lahaul and Spiti.
                  </p>
                  <p>
                    The trek crosses the Hampta Pass at 14,100 feet, offering
                    views of the Pir Panjal and Dhauladhar ranges. A highlight
                    is the Chandratal Lake, often called the 'Moon Lake' for its
                    crescent shape.
                  </p>
                  <h4 className="mt-4 font-semibold">What to Expect:</h4>
                  <ul className="list-inside list-disc space-y-1">
                    {whatToExpect.map((item, i) => (
                      <li key={i}>✅ {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'Quick Facts' && (
                <div className="rounded-lg bg-white p-6">
                  <h3 className="text-xl font-semibold">Quick Facts</h3>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="grid gap-4 md:grid-cols-2">
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
                  <div className="space-y-4 rounded-lg bg-gray-50 p-6 shadow-md">
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
                  <div className="grid gap-6 md:grid-cols-2">
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
                        <li>
                          Carry ORS, Diamox, painkillers, and altitude meds
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">
                        Guides & Signals
                      </h4>
                      <ul className="list-inside list-disc text-gray-600">
                        <li>Always trek with certified guides</li>
                        <li>Carry a whistle and torch, stay with group</li>
                        <li>
                          Mobile signals vanish after Jobra, rely on guides
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamptaPassTrek;

import { useState } from 'react';
import { ReactElement } from 'react';
import Treks from './tabs/Treks';
import EventsAndExperiences from './tabs/EventsAndExperiences';

type CategoryId = 'Treks' | 'EventsAndExperiences';

interface Category {
  id: CategoryId;
  label: string;
  icon: ReactElement;
}

// Mountain and Calendar SVG Icons
const MountainIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l3-3 4 4 6-6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21L12 12l9 9H3z" />
  </svg>
);

const CalendarIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const categories: Category[] = [
  { 
    id: 'Treks', 
    label: 'Adventures', 
    icon: <MountainIcon className="w-5 h-5 md:w-6 md:h-6" />
  },
  { 
    id: 'EventsAndExperiences', 
    label: 'Events & Experiences', 
    icon: <CalendarIcon className="w-5 h-5 md:w-6 md:h-6" />
  },
];

export default function CategoryTabs() {
  const [activeTab, setActiveTab] = useState<CategoryId>('Treks');

  return (
    <section className="w-full bg-[#F2F2F2]">
      {/* Responsive Adventure Tabs Container */}
      <div className="flex -translate-y-8 justify-center px-4">
        {/* Mobile: Vertical Stack | Desktop: Horizontal */}
        <div className="w-full max-w-4xl">
          {/* Mobile Layout (Vertical Stack) */}
          <div className="flex flex-col space-y-4 md:hidden">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`
                  flex items-center justify-center space-x-3 rounded-xl min-h-12 px-6 py-3
                  text-base font-semibold tracking-wide transition-all duration-300
                  backdrop-blur-lg border shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent
                  ${activeTab === category.id
                    ? 'bg-white/40 border-white/60 text-gray-800 shadow-xl'
                    : 'bg-white/20 border-white/30 text-gray-700 hover:bg-white/30 hover:border-white/40 hover:shadow-xl'
                  }
                `}
                onClick={() => setActiveTab(category.id)}
                aria-pressed={activeTab === category.id}
              >
                {category.icon}
                <span className="drop-shadow-lg">
                  {category.label}
                </span>
              </button>
            ))}
          </div>

          {/* Desktop Layout (Horizontal) */}
          <div className="hidden md:flex rounded-2xl bg-white/30 backdrop-blur-lg border border-white/40 p-3 shadow-2xl gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`
                  flex-1 flex items-center justify-center space-x-3 rounded-xl px-8 py-3
                  text-lg font-semibold tracking-wide transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent
                  ${activeTab === category.id
                    ? 'bg-white/50 border border-white/60 text-gray-800 shadow-lg'
                    : 'text-gray-700 hover:bg-white/20 hover:shadow-md'
                  }
                `}
                onClick={() => setActiveTab(category.id)}
                aria-pressed={activeTab === category.id}
              >
                {category.icon}
                <span className="drop-shadow-lg">
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-8 sm:px-8">
        {activeTab === 'Treks' && <Treks />}
        {activeTab === 'EventsAndExperiences' && <EventsAndExperiences />}
      </div>
    </section>
  );
}

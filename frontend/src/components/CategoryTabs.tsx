import { useState } from 'react';
import { ReactElement } from 'react';
import { Mountains, Star } from 'phosphor-react';
import Treks from './tabs/Treks';
import EventsAndExperiences from './tabs/EventsAndExperiences';

type CategoryId = 'Treks' | 'EventsAndExperiences';

interface Category {
  id: CategoryId;
  label: string;
  icon: ReactElement;
}

const categories: Category[] = [
  { 
    id: 'EventsAndExperiences', 
    label: 'Events & Experiences', 
    icon: <Star size={24} weight="regular" />
  },
  { 
    id: 'Treks', 
    label: 'Adventures', 
    icon: <Mountains size={24} weight="regular" />
  },
];

export default function CategoryTabs() {
  const [activeTab, setActiveTab] = useState<CategoryId>('EventsAndExperiences');

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
                  text-base font-medium tracking-wide transition-all duration-300
                  backdrop-blur-lg border shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent
                  ${activeTab === category.id
                    ? 'bg-white/40 border-white/60 text-gray-700 shadow-xl'
                    : 'bg-white/20 border-white/30 text-gray-600 hover:bg-white/30 hover:border-white/40 hover:shadow-xl'
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
                  text-lg font-medium tracking-wide transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent
                  ${activeTab === category.id
                    ? 'bg-white/50 border border-white/60 text-gray-700 shadow-lg'
                    : 'text-gray-600 hover:bg-white/20 hover:shadow-md'
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

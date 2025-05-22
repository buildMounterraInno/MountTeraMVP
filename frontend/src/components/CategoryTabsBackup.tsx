import { useState } from 'react';
import PlacesToSee from './tabs/Treks';
import ThingsToDo from './tabs/Experience';
import Events from './tabs/Events';

type CategoryId = 'places' | 'things' | 'events';

export default function CategoryTabs() {
  const [activeTab, setActiveTab] = useState<CategoryId>('places');

  const categories: { id: CategoryId; label: string }[] = [
    { id: 'places', label: 'Places to See' },
    { id: 'things', label: 'Things to Do' },
    { id: 'events', label: 'Events' },
  ];

  return (
    <div className="max-h-screen w-full bg-white">
      {/* Tabs Container */}
      <div className="flex -translate-y-13 justify-around sm:px-4">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`font-tpc rounded-t-lg px-4 pt-2 pb-4 text-lg font-medium transition-colors focus:outline-none sm:px-6 sm:pb-3 sm:text-2xl ${
              activeTab === category.id ? 'bg-white text-black' : 'text-white'
            }`}
            onClick={() => setActiveTab(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="px-4 sm:px-8">
        {activeTab === 'places' && <PlacesToSee />}
        {activeTab === 'things' && <ThingsToDo />}
        {activeTab === 'events' && <Events />}
      </div>
    </div>
  );
}

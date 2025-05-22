import { useState } from 'react';
import PlacesToSee from './tabs/PlacesToSee';
import ThingsToDo from './tabs/ThingsToDo';
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
      <div className="flex justify-around -translate-y-13 sm:px-4">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`font-tpc px-4 pt-2 sm:px-6 pb-4 sm:pb-3 rounded-t-lg text-lg sm:text-2xl font-medium transition-colors focus:outline-none ${
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

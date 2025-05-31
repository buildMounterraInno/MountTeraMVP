import { useState } from 'react';
import Treks from './tabs/Treks';
import Experience from './tabs/Experience';
import Events from './tabs/Events';

type CategoryId = 'Treks' | 'Experience' | 'Events';

interface Category {
  id: CategoryId;
  label: string;
}

const categories: Category[] = [
  { id: 'Treks', label: 'Treks' },
  { id: 'Experience', label: 'Experience' },
  { id: 'Events', label: 'Events' },
];

export default function CategoryTabs() {
  const [activeTab, setActiveTab] = useState<CategoryId>('Treks');

  return (
    <section className="w-full bg-[#F2F2F2]">
      {/* Tabs - Restored original positioning */}
      <div className="flex -translate-y-12 justify-around sm:px-4">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`font-tpc rounded-t-lg px-4 pt-2 pb-4 text-lg font-medium transition-colors focus:outline-none sm:px-6 sm:pb-2 sm:text-2xl ${
              activeTab === category.id
                ? 'bg-[#F2F2F2] text-black'
                : 'text-white'
            } `}
            onClick={() => setActiveTab(category.id)}
            aria-pressed={activeTab === category.id}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 pb-8 sm:px-8">
        {activeTab === 'Treks' && <Treks />}
        {activeTab === 'Experience' && <Experience />}
        {activeTab === 'Events' && <Events />}
      </div>
    </section>
  );
}

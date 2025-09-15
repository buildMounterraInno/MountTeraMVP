import { useState, useEffect, useCallback } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchType = 'adventures' | 'events';

interface SearchResult {
  id: number;
  name: string;
  location: string;
}

// Backend-ready API functions (commented out for now)
// const searchAdventures = async (query: string) => {
//   const response = await fetch(`/api/adventures/search?q=${query}`);
//   return response.json();
// };

// const searchEvents = async (query: string) => {
//   const response = await fetch(`/api/events/search?q=${query}`);
//   return response.json();
// };

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState<SearchType>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Search Icons
  const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const ClearIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  // Dynamic placeholder text
  const getPlaceholder = () => {
    return selectedType === 'adventures' 
      ? 'Search for treks, climbs, expeditions...'
      : 'Search for events, workshops, experiences...';
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mock results for now - replace with actual API calls
        const mockResults = selectedType === 'adventures' 
          ? [
              { id: 1, name: `${query} Adventure Trek`, location: 'Himachal Pradesh' },
              { id: 2, name: `${query} Mountain Climb`, location: 'Uttarakhand' },
            ]
          : [
              { id: 1, name: `${query} Workshop`, location: 'Delhi' },
              { id: 2, name: `${query} Experience Event`, location: 'Mumbai' },
            ];

        setResults(mockResults);
        
        // Uncomment for actual API integration:
        // if (selectedType === 'adventures') {
        //   const adventureResults = await searchAdventures(query);
        //   setResults(adventureResults);
        // } else {
        //   const eventResults = await searchEvents(query);
        //   setResults(eventResults);
        // }
      } catch (err) {
        setError('Search failed. Please try again.');
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    },
    [selectedType]
  );

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        debouncedSearch(searchQuery);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, debouncedSearch]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setError(null);
  };

  // Reset when tab changes
  const handleTabChange = (type: SearchType) => {
    setSelectedType(type);
    setSearchQuery('');
    setResults([]);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
          {/* Header with Close Button */}
          <div className="flex justify-between items-center p-6 pb-4">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              Search Adventures
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Close search modal"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Tab Selection */}
          <div className="px- pb-2">
            {/* Mobile: Stacked Layout */}
            <div className="flex flex-col space-y-2 md:hidden">
              {[
                // { id: 'adventures' as SearchType, label: 'Adventures' }, // Commented out for now
                { id: 'events' as SearchType, label: 'Events & Experiences' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                    selectedType === tab.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Desktop: Horizontal Layout */}
            <div className="hidden md:flex justify-center">
              <div className="flex bg-white/5 rounded-xl p-1">
                {[
                  // { id: 'adventures' as SearchType, label: 'Adventures' }, // Commented out for now
                  { id: 'events' as SearchType, label: 'Events & Experiences' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                      selectedType === tab.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="px-6 pb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-lg"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <ClearIcon />
                </button>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="px-6 pb-6 max-h-96 overflow-y-auto">
            {error && (
              <div className="text-red-300 text-center py-4 bg-red-500/10 rounded-xl border border-red-500/20">
                {error}
              </div>
            )}

            {isSearching && (
              <div className="text-white/70 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                Searching...
              </div>
            )}

            {!isSearching && !error && results.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-lg mb-4">
                  Search Results ({results.length})
                </h3>
                {results.map((result: any) => (
                  <div
                    key={result.id}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg"
                  >
                    <h4 className="text-white font-semibold">{result.name}</h4>
                    <p className="text-white/70 text-sm">{result.location}</p>
                  </div>
                ))}
              </div>
            )}

            {!isSearching && !error && searchQuery && results.length === 0 && (
              <div className="text-white/70 text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <p>No {selectedType} found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try different keywords or check spelling</p>
              </div>
            )}

            {!searchQuery && (
              <div className="text-white/50 text-center py-8">
                <div className="text-4xl mb-4">
                  {selectedType === 'adventures' ? '🏔️' : '🎉'}
                </div>
                <p>Start typing to search for {selectedType}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
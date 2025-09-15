import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { treks, Trek } from '../data/trek';
import { events, Event } from '../data/events';
import { experiences, Experience } from '../data/experience';
import SearchBar from '../components/common/SearchBar';
import { Filter, Grid, List, Star, MapPin } from 'lucide-react';
import { NearbyApiService } from '../services/nearby-api';

type SearchItem = (Trek | Event | Experience) & {
  type: 'trek' | 'event' | 'experience';
  title: string;
  location: string;
  image: string;
  url?: string;
  rating?: number;
  numericPrice?: number;
};

interface FilterState {
  priceRange: [number, number];
  location: string;
  rating: number;
  sortBy: 'price' | 'rating' | 'name' | 'relevance';
  sortOrder: 'asc' | 'desc';
}

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('destination') || '';
  const searchType = searchParams.get('type') || 'events-experiences';
  const fromDate = searchParams.get('fromDate');
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [detailedApiResults, setDetailedApiResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    location: '',
    rating: 0,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  // API search effect - fetch search results then get detailed data
  useEffect(() => {
    const fetchApiResults = async () => {
      if (searchType === 'events-experiences' && searchQuery.length >= 1) {
        setLoading(true);
        setDetailedApiResults([]);
        try {
          const response = await fetch('https://www.vastusetu.com/api/search/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchTerm: searchQuery })
          });
          if (response.ok) {
            const responseData = await response.json();
            const data = responseData.data || responseData;
            
            // Fetch detailed data for each result to get images
            const detailedResults = await Promise.allSettled(
              data.map(async (item: any) => {
                try {
                  const isExperience = item.source === 'recurring_events';
                  if (isExperience) {
                    const detailed = await NearbyApiService.getExperienceDetails(item.id);
                    return {
                      ...detailed,
                      source: 'recurring_events',
                      type: 'experience',
                      searchTitle: item.event_name || item.name
                    };
                  } else {
                    const detailed = await NearbyApiService.getEventDetails(item.id);
                    return {
                      ...detailed,
                      source: 'events',
                      type: 'event',
                      searchTitle: item.event_name || item.name
                    };
                  }
                } catch (error) {
                  // Return original item if detailed fetch fails
                  return {
                    ...item,
                    type: item.source === 'recurring_events' ? 'experience' : 'event'
                  };
                }
              })
            );
            
            const successfulResults = detailedResults
              .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
              .map(result => result.value);
              
            setDetailedApiResults(successfulResults);
          } else {
          }
        } catch (error) {
        } finally {
          setLoading(false);
        }
      } else if (searchType === 'events-experiences') {
        // If no search query, show empty results
        setDetailedApiResults([]);
        setLoading(false);
      }
    };

    fetchApiResults();
  }, [searchQuery, searchType]);

  // Combine all data into unified format
  const localItems: SearchItem[] = [
    ...treks.map(trek => ({
      ...trek,
      type: 'trek' as const,
      title: trek.placeName,
      location: trek.state,
      image: trek.destinationImage,
      url: trek.pageUrl,
      rating: 4.2,
      numericPrice: 5000
    })),
    ...events.map(event => ({
      ...event,
      type: 'event' as const,
      title: event.catchPhrase,
      location: event.state,
      image: event.destinationImage,
      rating: 4.0,
      numericPrice: typeof event.price === 'number' ? event.price : 1000
    })),
    ...experiences.map(experience => ({
      ...experience,
      type: 'experience' as const,
      title: experience.catchPhrase,
      location: experience.state,
      image: experience.destinationImage,
      rating: 4.5,
      numericPrice: parseInt(experience.price.replace(/[₹,\/\s]/g, '').split(' ')[0]) || 3000
    }))
  ];

  // API items - use detailed results with proper image mapping
  const apiItems: SearchItem[] = detailedApiResults.map(item => ({
    ...item,
    id: item.id || Math.random().toString(),
    type: item.type as 'event' | 'experience',
    title: item.event_name || item.searchTitle || item.name || item.title || 'Untitled',
    location: item.address_full_address || item.address_city || item.address || item.location || item.venue || 'Location TBD',
    image: item.type === 'experience' 
      ? (item.experience_photo_urls?.[0] || item.banner_image || item.image) 
      : (item.banner_image || item.experience_photo_urls?.[0] || item.image),
    rating: item.rating || 4.2,
    numericPrice: (() => {
      // For experiences, try ticket_price first
      if (item.type === 'experience' && item.ticket_price) {
        return typeof item.ticket_price === 'number' ? item.ticket_price : parseInt(item.ticket_price) || 2000;
      }
      // For events, try fixed_price first
      if (item.type === 'event' && item.fixed_price) {
        return typeof item.fixed_price === 'number' ? item.fixed_price : parseInt(item.fixed_price) || 2000;
      }
      // Fallback to general price field
      if (typeof item.price === 'number') return item.price;
      if (typeof item.price === 'string') {
        const cleaned = item.price.replace(/[₹,\/\s]/g, '');
        const parsed = parseInt(cleaned);
        return isNaN(parsed) ? 2000 : parsed;
      }
      return 2000;
    })()
  }));

  const allItems = searchType === 'events-experiences' && detailedApiResults.length > 0 ? apiItems : localItems;

  // Filter based on search type
  let typeFilteredItems = searchType === 'adventures' 
    ? allItems.filter(item => item.type === 'trek')
    : allItems.filter(item => item.type === 'event' || item.type === 'experience');

  // Apply all filters
  let filteredItems = typeFilteredItems.filter((item) => {
    // Search query filter
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Price filter
    const matchesPrice = !item.numericPrice || (
      item.numericPrice >= filters.priceRange[0] && 
      item.numericPrice <= filters.priceRange[1]
    );

    // Location filter
    const matchesLocation = !filters.location || 
      item.location.toLowerCase().includes(filters.location.toLowerCase());

    // Rating filter
    const matchesRating = !filters.rating || 
      (item.rating && item.rating >= filters.rating);

    return matchesSearch && matchesPrice && matchesLocation && matchesRating;
  });

  // Apply sorting
  filteredItems.sort((a, b) => {
    let comparison = 0;
    
    switch (filters.sortBy) {
      case 'price':
        comparison = (a.numericPrice || 0) - (b.numericPrice || 0);
        break;
      case 'rating':
        comparison = (a.rating || 0) - (b.rating || 0);
        break;
      case 'name':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'relevance':
      default:
        comparison = 0;
    }
    
    return filters.sortOrder === 'desc' ? -comparison : comparison;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header - Fixed below navbar */}
      <div className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-40 mt-20">
        <div className="container mx-auto px-4 py-6">
          <SearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Info & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {searchQuery ? `Search Results for "${searchQuery}"` : 
               searchType === 'adventures' ? 'Adventures' : 'Events & Experiences'}
            </h1>
            <p className="text-lg text-gray-600">
              {loading ? 'Searching...' : `${filteredItems.length} ${filteredItems.length === 1 ? 'result' : 'results'} found`}
              {fromDate && ` from ${new Date(fromDate).toLocaleDateString()}`}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* View Toggle */}
            <div className="flex border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List size={20} />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Filter size={16} />
              Filters
            </button>

            {/* Sort Dropdown */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder: sortOrder as any }));
              }}
              className="px-4 py-2 border rounded-lg text-gray-700 bg-white"
            >
              <option value="relevance-desc">Most Relevant</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="name-asc">A to Z</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 bg-white rounded-lg shadow-sm p-6 h-fit">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]] }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value) || 10000] }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Filter by location"
                />
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value={0}>Any Rating</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({ priceRange: [0, 10000], location: '', rating: 0, sortBy: 'relevance', sortOrder: 'desc' })}
                className="w-full text-blue-600 text-sm hover:text-blue-800"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading results...</p>
                </div>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className={`${viewMode === 'grid' 
                ? 'flex flex-wrap gap-6 justify-start' 
                : 'space-y-4'
              }`}>
                {filteredItems.map((item) => {
                  const hasUrl = item.url || item.type === 'event' || item.type === 'experience';
                  const targetUrl = item.url || `/booking/${item.type}/${item.id}`;

                  if (!hasUrl) {
                    return (
                      <div key={`${item.type}-${item.id}`}>
                        {/* Non-clickable item */}
                      </div>
                    );
                  }

                  if (viewMode === 'grid') {
                    // Grid Card View - Match EventCard/ExperienceCard design exactly
                    return (
                      <Link key={`${item.type}-${item.id}`} to={targetUrl} target="_blank" rel="noopener noreferrer">
                        <div className="w-80 h-[400px] bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] flex-shrink-0 flex flex-col">
                          {/* Banner Image - Top */}
                          <div className="h-56 relative overflow-hidden rounded-2xl m-4 mb-2 flex-shrink-0">
                            {/* Price Tag Overlay */}
                            <div className="absolute top-4 left-4 z-10">
                              <span className="bg-black/70 text-white text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                                From ₹{item.numericPrice || 0}
                              </span>
                            </div>
                            {/* Wishlist Button */}
                            <div className="absolute top-4 right-4 z-10">
                              <button 
                                onClick={(e) => e.preventDefault()}
                                className="p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm transform hover:scale-110 active:scale-95 bg-white/90 hover:bg-red-500 text-red-500 hover:text-white"
                              >
                                <svg className="w-4 h-4 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </button>
                            </div>
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="w-full h-full bg-gradient-to-br ${
                                        item.type === 'trek' ? 'from-green-500 to-green-600' :
                                        item.type === 'event' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600'
                                      } flex items-center justify-center">
                                        <div class="text-center text-white">
                                          <p class="text-sm font-medium">${item.title?.substring(0, 20) || item.type}</p>
                                        </div>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${
                                item.type === 'trek' ? 'from-green-500 to-green-600' :
                                item.type === 'event' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600'
                              } flex items-center justify-center`}>
                                <div className="text-center text-white">
                                  <p className="text-sm font-medium">{item.title?.substring(0, 20) || item.type}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Card Content - Bottom */}
                          <div className="px-5 pb-5 flex-1 flex flex-col justify-end">
                            <div className="space-y-2">
                              <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                                {item.title}
                              </h3>
                              
                              {/* Show description if available */}
                              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
                                {item.type === 'trek' ? 'Adventure trek experience' : 
                                 item.type === 'event' ? 'Event experience' : 
                                 'Experience description'}
                              </p>

                              <div className="space-y-1 pt-1">
                                <div className="flex items-center text-gray-500 text-xs">
                                  <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                  </svg>
                                  {item.location}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  } else {
                    // List View
                    return (
                      <Link key={`${item.type}-${item.id}`} to={targetUrl} target="_blank" rel="noopener noreferrer">
                        <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-5 cursor-pointer group border border-gray-100">
                          <div className="flex gap-6">
                            <div className="relative w-36 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                  <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-xs font-medium">No Image</span>
                                </div>
                              )}
                              <div className="absolute top-2 right-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${
                                  item.type === 'trek' ? 'bg-green-600' :
                                  item.type === 'event' ? 'bg-blue-600' : 'bg-purple-600'
                                }`}>
                                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                                {item.title}
                              </h3>
                              <div className="flex items-center text-gray-600 text-sm mb-2">
                                <MapPin size={14} className="mr-1" />
                                <span>{item.location}</span>
                                {item.rating && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <Star size={14} fill="currentColor" className="text-yellow-500 mr-1" />
                                    <span>{item.rating}</span>
                                  </>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm line-clamp-2">Experience description...</p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <div className="font-bold text-xl text-gray-900">
                                {item.numericPrice ? `₹${item.numericPrice.toLocaleString()}` : 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">per person</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-600 text-lg mb-4">
                  {searchQuery ? `No results found for "${searchQuery}"` : 'No results found'}
                </div>
                <p className="text-gray-500 mb-8">
                  Try adjusting your search terms or filters, or browse all {searchType === 'adventures' ? 'adventures' : 'events & experiences'}
                </p>
                {typeFilteredItems.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {typeFilteredItems.slice(0, 8).map((item) => {
                      const hasUrl = item.url || item.type === 'event' || item.type === 'experience';
                      const targetUrl = item.url || `/booking/${item.type}/${item.id}`;

                      return hasUrl ? (
                        <Link key={`${item.type}-${item.id}`} to={targetUrl} target="_blank" rel="noopener noreferrer">
                          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group">
                            <div className="relative h-48 overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-3 right-3">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${
                                  item.type === 'trek' ? 'bg-green-600' :
                                  item.type === 'event' ? 'bg-blue-600' : 'bg-purple-600'
                                }`}>
                                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                                {item.title}
                              </h3>
                              <div className="flex items-center text-gray-600 text-xs mb-2">
                                <MapPin size={12} className="mr-1" />
                                <span className="truncate">{item.location}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  {item.rating && (
                                    <div className="flex items-center text-yellow-500">
                                      <Star size={12} fill="currentColor" />
                                      <span className="text-xs text-gray-600 ml-1">{item.rating}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-gray-900">
                                    {item.numericPrice ? `₹${item.numericPrice.toLocaleString()}` : 'N/A'}
                                  </div>
                                  <div className="text-xs text-gray-500">per person</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div key={`${item.type}-${item.id}`}>
                          {/* Non-clickable fallback */}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

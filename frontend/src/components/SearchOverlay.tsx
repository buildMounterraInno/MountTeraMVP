import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Minus, X } from 'lucide-react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useNavigate } from 'react-router-dom';
import TypewriterText from './TypewriterText';
import { type Event, events } from '../data/events';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchType = 'events-experiences' | 'adventures';
type SearchSection = 'where' | 'date' | 'who' | null;

interface SearchData {
  destination: string;
  fromDate?: Date;
  adults: number;
  searchType: SearchType;
}

const EventTile: React.FC<Event> = ({
  destinationImage,
  catchPhrase,
  state,
  price
}) => {
  return (
    <article
      className="relative h-40 overflow-hidden rounded-lg bg-cover bg-center p-4 text-white shadow-md transition-shadow hover:shadow-lg"
      style={{ backgroundImage: `url(${destinationImage})` }}
      aria-labelledby={`event-title-${state}`}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/40"></div>
      <div className="absolute bottom-3 left-3 z-10 text-left">
        <h3
          id={`event-title-${catchPhrase}`}
          className="text-sm font-semibold text-white text-left"
        >
          {catchPhrase}
        </h3>
        <p className="text-xs text-white/90 text-left">{state}</p>
        <p className="text-xs font-medium text-white text-left">₹{price} / person</p>
      </div>
    </article>
  );
};

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<SearchSection>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [searchData, setSearchData] = useState<SearchData>({
    destination: '',
    fromDate: undefined,
    adults: 0,
    searchType: 'events-experiences',
  });
  const navigate = useNavigate();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 400); // Match animation duration
  };

  const handleSearch = useCallback(() => {
    const searchParams = new URLSearchParams();
    if (searchData.destination) {
      searchParams.set('destination', searchData.destination);
    }
    if (searchData.fromDate) {
      searchParams.set('fromDate', format(searchData.fromDate, 'yyyy-MM-dd'));
    }
    if (searchData.adults > 0) {
      searchParams.set('adults', searchData.adults.toString());
    }
    searchParams.set('type', searchData.searchType);
    onClose();
    navigate(`/search?${searchParams.toString()}`);
  }, [searchData, navigate, onClose]);

  const getPlaceholderText = () => {
    return searchData.searchType === 'adventures' 
      ? 'Search Adventures' 
      : 'Search Events & Experiences';
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-md z-40 ${
          isClosing ? 'animate-fade-out' : 'animate-fade-in'
        }`}
        onClick={handleClose}
      />
      
      {/* Search Overlay */}
      <div className={`fixed inset-0 z-50 ${
        isClosing ? 'animate-slide-up' : 'animate-slide-down'
      }`}>
        <div className="h-full bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-lg border border-white/20">
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white hover:text-gray-200 transition-all duration-200 z-50"
            aria-label="Close search"
          >
            <X size={24} />
          </button>

          {/* Search Content */}
          <div className="relative z-10 flex h-full items-start justify-center px-4 sm:px-6 lg:px-8 pt-20">
            <div className="w-full max-w-4xl text-center">
              <div className="mb-8 flex items-center justify-center">
                <h1 className="font-tpc text-4xl leading-tight font-semibold text-white drop-shadow-lg sm:text-5xl md:text-6xl whitespace-nowrap text-center">
                  Choose Your Next{' '}
                  <TypewriterText 
                    text={searchData.searchType === 'adventures' ? 'Adventure' : 'Experience'}
                    speed={120}
                    className="inline"
                  />
                </h1>
              </div>

              {/* Search Container */}
              <div className="relative mx-auto max-w-[850px]">
                {/* Search Type Toggle Buttons */}
                <div className="mb-6 flex justify-center">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSearchData(prev => ({ ...prev, searchType: 'events-experiences' }))}
                      className={`px-6 py-2 text-sm font-medium transition-all duration-300 ${
                        searchData.searchType === 'events-experiences'
                          ? 'bg-[#1E63EF] text-white shadow-md'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      style={{ borderRadius: '30px' }}
                    >
                      Events & Experiences
                    </button>
                    <button
                      onClick={() => setSearchData(prev => ({ ...prev, searchType: 'adventures' }))}
                      className={`px-6 py-2 text-sm font-medium transition-all duration-300 ${
                        searchData.searchType === 'adventures'
                          ? 'bg-[#1E63EF] text-white shadow-md'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      style={{ borderRadius: '30px' }}
                    >
                      Adventures
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center rounded-full bg-white shadow-xl transition-shadow hover:shadow-2xl">
                  {/* Where */}
                  <div 
                    className={`flex-grow px-7 py-3 text-left cursor-pointer transition-all duration-200 rounded-l-full ${
                      activeSection === 'where' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveSection('where')}
                  >
                    <label className="block text-xs font-semibold text-gray-800">Where</label>
                    <input
                      type="text"
                      value={searchData.destination}
                      onChange={(e) => setSearchData(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder={getPlaceholderText()}
                      className="mt-0.5 w-full border-none bg-transparent text-sm text-gray-600 placeholder-gray-600 outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Divider */}
                  <div className="h-6 w-[1px] bg-gray-200" />

                  {/* Date */}
                  <div 
                    className={`px-6 py-3 cursor-pointer transition-all duration-200 ${
                      activeSection === 'date' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveSection('date')}
                  >
                    <div className="text-left">
                      <p className="text-xs font-semibold text-gray-800">From</p>
                      <p className="mt-0.5 text-sm text-gray-600">
                        {searchData.fromDate ? format(searchData.fromDate, 'MMM d') : 'Select date'}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-6 w-[1px] bg-gray-200" />

                  {/* Who */}
                  <div 
                    className={`flex items-center gap-3 rounded-r-full py-3 pr-2 pl-6 cursor-pointer transition-all duration-200 ${
                      activeSection === 'who' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveSection('who')}
                  >
                    <div className="text-left">
                      <p className="text-xs font-semibold text-gray-800">Who</p>
                      <p className="mt-0.5 text-sm text-gray-600">
                        {searchData.adults > 0
                          ? `${searchData.adults} ${searchData.adults === 1 ? 'guest' : 'guests'}`
                          : 'Add guests'}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSearch();
                      }}
                      className="bg-[#1E63EF] flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:bg-[#E31E56]"
                    >
                      <Search size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Dropdowns */}
                {activeSection === 'date' && (
                  <div className="absolute z-50 mt-4 left-1/2 transform -translate-x-1/2 rounded-[32px] bg-white p-6 shadow-2xl border border-gray-100 min-w-[350px] max-w-[90vw]">
                    <DayPicker
                      mode="single"
                      selected={searchData.fromDate}
                      onSelect={(date) => setSearchData(prev => ({ ...prev, fromDate: date || undefined }))}
                      numberOfMonths={1}
                      disabled={{ before: new Date() }}
                      classNames={{
                        months: 'flex gap-8',
                        month: 'space-y-4',
                        caption: 'flex justify-between items-center px-4 py-2 text-base font-medium',
                        caption_label: 'text-base font-semibold',
                        nav: 'flex items-center gap-2',
                        table: 'w-full border-collapse space-y-1',
                        head_row: 'flex',
                        head_cell: 'text-gray-500 font-medium w-10 h-10 flex items-center justify-center text-xs uppercase',
                        row: 'flex w-full',
                        cell: 'relative w-10 h-10 flex items-center justify-center',
                        day: 'rounded-full w-9 h-9 text-sm font-normal transition hover:bg-gray-200',
                        day_selected: 'bg-black text-white hover:bg-black w-9 h-9 rounded-full',
                        day_today: 'border border-gray-400',
                        day_outside: 'text-gray-300',
                        day_disabled: 'text-gray-300 line-through opacity-40',
                        day_hidden: 'invisible',
                      }}
                    />
                  </div>
                )}

                {activeSection === 'who' && (
                  <div className="absolute top-[calc(100%+12px)] right-4 z-50 w-[320px] max-w-[calc(100vw-2rem)] rounded-[32px] bg-white p-6 shadow-xl">
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <h3 className="text-base font-medium">Adults</h3>
                        <p className="text-sm text-gray-500">Ages 13 or above</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSearchData(prev => ({ ...prev, adults: Math.max(0, prev.adults - 1) }))}
                          disabled={searchData.adults === 0}
                          className={`h-8 w-8 rounded-full border transition-all ${
                            searchData.adults === 0
                              ? 'cursor-not-allowed border-gray-200 text-gray-300'
                              : 'border-gray-300 text-gray-600 hover:border-gray-900'
                          }`}
                        >
                          <Minus size={14} className="mx-auto" />
                        </button>
                        <span className="min-w-[3rem] text-center text-base">{searchData.adults}</span>
                        <button
                          onClick={() => setSearchData(prev => ({ ...prev, adults: prev.adults + 1 }))}
                          className="h-8 w-8 rounded-full border border-gray-300 text-gray-600 transition-all hover:border-gray-900"
                        >
                          <Plus size={14} className="mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Events Section */}
              <div className="mt-12 max-w-5xl mx-auto">
                <h2 className="mb-6 text-2xl font-bold text-white text-center">
                  Enjoy the local Events around you
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {events.slice(0, 6).map((event) => (
                    <EventTile key={event.id} {...event} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;
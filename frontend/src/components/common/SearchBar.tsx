import { useState, useRef, useEffect, useCallback, Children, isValidElement } from 'react';
import { Search, Plus, Minus, X } from 'lucide-react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useNavigate } from 'react-router-dom';

type SearchSection = 'where' | 'date' | 'who' | null;
type SearchType = 'events-experiences' | 'adventures';

interface SearchData {
  destination: string;
  fromDate?: Date;
  adults: number;
  searchType: SearchType;
}

const baseButtonStyle = 'relative cursor-pointer transition-all';
const activeButtonStyle = 'bg-gray-100';
const hoverButtonStyle = 'hover:bg-gray-50';
const roundedStyle = 'rounded-[32px]';

const SearchBar = () => {
  const [activeSection, setActiveSection] = useState<SearchSection>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [searchData, setSearchData] = useState<SearchData>({
    destination: '',
    fromDate: undefined,
    adults: 0,
    searchType: 'events-experiences',
  });
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setActiveSection(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setIsMobileModalOpen(false);
    navigate(`/search?${searchParams.toString()}`);
  }, [searchData, navigate]);

  // Function to scroll search bar to optimal position for calendar visibility
  const scrollToCenter = useCallback(() => {
    if (searchRef.current) {
      const element = searchRef.current;
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      
      // Calendar needs about 400px height, position search bar to leave enough space
      const calendarHeight = 400;
      const bufferSpace = 50;
      const requiredSpaceBelow = calendarHeight + bufferSpace;
      
      // Position search bar so there's adequate space below for calendar
      const idealTop = window.innerHeight - requiredSpaceBelow - elementRect.height;
      const targetPosition = absoluteElementTop - Math.max(idealTop, window.innerHeight / 4);
      
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  }, []);

  // Handle section activation with scroll
  const handleSectionClick = useCallback((section: SearchSection) => {
    setActiveSection(section);
    if (section === 'date') {
      // Delay to ensure the section is set and calendar is rendered before scrolling
      setTimeout(() => {
        scrollToCenter();
      }, 100);
    }
  }, [scrollToCenter]);

  const getPlaceholderText = () => {
    return searchData.searchType === 'adventures' 
      ? 'Search Adventures' 
      : 'Search Events & Experiences';
  };

  return (
    <div
      ref={searchRef}
      className="relative mx-auto w-full max-w-[850px] px-4 sm:px-6"
    >
      {/* Search Type Toggle Buttons */}
      <div className="mb-4 flex justify-start">
        <div className="flex gap-3">
          <button
            onClick={() => setSearchData(prev => ({ ...prev, searchType: 'events-experiences' }))}
            className={`px-6 py-2 text-sm font-medium transition-all duration-300 ${
              searchData.searchType === 'events-experiences'
                ? 'bg-[#1E63EF] text-white shadow-md'
                : 'bg-[#F2F2F2] text-gray-600 hover:text-gray-800'
            }`}
            style={{ borderRadius: '30px', marginLeft: '20px' }}
          >
            Events & Experiences
          </button>
          <button
            onClick={() => setSearchData(prev => ({ ...prev, searchType: 'adventures' }))}
            className={`px-6 py-2 text-sm font-medium transition-all duration-300 ${
              searchData.searchType === 'adventures'
                ? 'bg-[#1E63EF] text-white shadow-md'
                : 'bg-[#F2F2F2] text-gray-600 hover:text-gray-800'
            }`}
            style={{ borderRadius: '30px' }}
          >
            Adventures
          </button>
        </div>
      </div>
      {/* Desktop Search Bar */}
      <div className="hidden items-center rounded-full bg-white shadow-md transition-shadow hover:shadow-lg md:flex">
        {/* Where */}
        <SectionButton
          isActive={activeSection === 'where'}
          className="mr-2 flex-grow px-7 py-3 text-left"
          onClick={() => handleSectionClick('where')}
        >
          <SearchField
            label="Where"
            value={searchData.destination}
            placeholder={getPlaceholderText()}
            onChange={(value) =>
              setSearchData((prev) => ({ ...prev, destination: value }))
            }
          />
        </SectionButton>

        <Divider />

        {/* Date Range */}
        <SectionButton
          isActive={activeSection === 'date'}
          className="mx-2 px-6 py-3"
          onClick={() => handleSectionClick('date')}
        >
          <SearchDisplay
            label="From"
            value={
              searchData.fromDate
                ? format(searchData.fromDate, 'MMM d')
                : 'Select date'
            }
          />
        </SectionButton>

        <Divider />

        {/* Who */}
        <SectionButton
          isActive={activeSection === 'who'}
          className="ml-2 flex items-center gap-3 rounded-r-full py-3 pr-2 pl-6"
          onClick={() => handleSectionClick('who')}
        >
          <SearchDisplay
            label="Who"
            value={
              searchData.adults > 0
                ? `${searchData.adults} ${searchData.adults === 1 ? 'guest' : 'guests'}`
                : 'Add guests'
            }
          />
          <SearchButton onClick={handleSearch} />
        </SectionButton>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileModalOpen(true)}
          className="flex w-full items-center gap-4 rounded-full border border-gray-200 bg-white px-6 py-4 shadow-md"
        >
          <Search size={20} className="text-gray-600" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-800">Where to?</p>
            <p className="text-xs text-gray-500">
              {searchData.destination || 'Anywhere'} •{' '}
              {searchData.fromDate
                ? format(searchData.fromDate, 'MMM d')
                : 'Any date'}{' '}
              •{' '}
              {searchData.adults > 0
                ? `${searchData.adults} guests`
                : 'Add guests'}
            </p>
          </div>
        </button>
      </div>

      {/* Mobile Modal */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <button
                onClick={() => setIsMobileModalOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={24} />
              </button>
              <span className="text-lg font-semibold">Search</span>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Where */}
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">Where to?</h3>
                <input
                  type="text"
                  value={searchData.destination}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      destination: e.target.value,
                    }))
                  }
                  placeholder={getPlaceholderText()}
                  className="w-full rounded-lg border border-gray-300 p-4 text-lg outline-none focus:border-gray-500 transition-all duration-300"
                />
              </div>

              {/* When */}
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">When?</h3>
                <div className="rounded-lg border border-gray-300 p-4">
                  <DayPicker
                    mode="single"
                    selected={searchData.fromDate}
                    onSelect={(date) =>
                      setSearchData((prev) => ({
                        ...prev,
                        fromDate: date || undefined,
                      }))
                    }
                    numberOfMonths={1}
                    disabled={{ before: new Date() }}
                    classNames={{
                      months: 'flex gap-8',
                      month: 'space-y-4 w-full',
                      caption: 'flex justify-between items-center px-4 py-2',
                      caption_label: 'text-base font-semibold',
                      nav: 'flex items-center gap-2',
                      table: 'w-full border-collapse space-y-1',
                      head_row: 'flex',
                      head_cell:
                        'text-gray-500 font-medium w-10 h-10 flex items-center justify-center text-xs uppercase',
                      row: 'flex w-full',
                      cell: 'relative w-10 h-10 flex items-center justify-center',
                      day: 'rounded-full w-9 h-9 text-sm font-normal transition hover:bg-gray-200',
                      day_selected: 'bg-black text-white hover:bg-black',
                      day_today: 'border border-gray-400',
                      day_outside: 'text-gray-300',
                      day_disabled: 'text-gray-300 line-through opacity-40',
                      day_hidden: 'invisible',
                    }}
                  />
                </div>
              </div>

              {/* Who */}
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">Who's coming?</h3>
                <div className="rounded-lg border border-gray-300 p-4">
                  <GuestSelector
                    adults={searchData.adults}
                    onChange={(adults) =>
                      setSearchData((prev) => ({ ...prev, adults }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4">
              <button
                onClick={handleSearch}
                className="bg-[#1E63EF] w-full rounded-lg py-4 text-center text-lg font-semibold text-white"
                disabled={!searchData.destination}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropdowns */}
      <Dropdowns
        activeSection={activeSection}
        searchData={searchData}
        onDateSelect={(date) =>
          setSearchData((prev) => ({ 
            ...prev, 
            fromDate: date || undefined
          }))
        }
        onGuestChange={(adults) =>
          setSearchData((prev) => ({ ...prev, adults }))
        }
      />
    </div>
  );
};

const SectionButton = ({
  isActive,
  onClick,
  children,
  className = '',
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  // Check if children contains a button
  const containsButton = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === SearchButton
  );

  const Component = containsButton ? 'div' : 'button';

  return (
    <Component
      onClick={onClick}
      className={`${baseButtonStyle} ${className} ${
        isActive ? activeButtonStyle : hoverButtonStyle
      } ${className.includes('rounded') ? '' : roundedStyle} ${
        isActive ? 'shadow-inner' : ''
      }`}
    >
      {children}
    </Component>
  );
};

const SearchField = ({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div onClick={handleDivClick} className="cursor-text">
      <label className="block text-xs font-semibold text-gray-800">
        {label}
      </label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-0.5 w-full border-none bg-transparent text-sm text-gray-600 placeholder-gray-600 outline-none transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

const SearchDisplay = ({ label, value }: { label: string; value: string }) => (
  <div className="text-left">
    <p className="text-xs font-semibold text-gray-800">{label}</p>
    <p className="mt-0.5 text-sm text-gray-600">{value}</p>
  </div>
);

const SearchButton = ({ onClick }: { onClick: () => void }) => {
  const buttonContent = (
    <>
      <Search size={20} strokeWidth={2.5} />
    </>
  );

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="bg-[#1E63EF] flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:bg-[#E31E56]"
    >
      {buttonContent}
    </button>
  );
};

const Divider = () => <div className="h-6 w-[1px] bg-gray-200" />;

const Dropdowns = ({
  activeSection,
  searchData,
  onDateSelect,
  onGuestChange,
}: {
  activeSection: SearchSection;
  searchData: SearchData;
  onDateSelect: (date: Date | undefined) => void;
  onGuestChange: (adults: number) => void;
}) => {
  const isDatePickerOpen = activeSection === 'date';

  return (
    <>
      {isDatePickerOpen && (
        <div className="absolute z-50 mt-4 left-1/2 transform -translate-x-1/2 rounded-[32px] bg-white p-6 shadow-2xl border border-gray-100 min-w-[350px] max-w-[90vw]">
          <DayPicker
            mode="single"
            selected={searchData.fromDate}
            onSelect={onDateSelect}
            numberOfMonths={1}
            disabled={{ before: new Date() }}
            classNames={{
              months: 'flex gap-8',
              month: 'space-y-4',
              caption:
                'flex justify-between items-center px-4 py-2 text-base font-medium',
              caption_label: 'text-base font-semibold',
              nav: 'flex items-center gap-2 ',
              table: 'w-full border-collapse space-y-1',
              head_row: 'flex',
              head_cell:
                'text-gray-500 font-medium w-10 h-10 flex items-center justify-center text-xs uppercase',
              row: 'flex w-full',
              cell: 'relative w-10 h-10 flex items-center justify-center',
              day: 'rounded-full w-9 h-9 text-sm font-normal transition hover:bg-gray-200',
              day_selected:
                'bg-black text-white hover:bg-black w-9 h-9 rounded-full',
              day_today: 'border border-gray-400',
              day_outside: 'text-gray-300',
              day_disabled: 'text-gray-300 line-through opacity-40',
              day_hidden: 'invisible',
            }}
          />
        </div>
      )}

      {activeSection === 'who' && (
        <div className="absolute top-[calc(100%+12px)] right-4 z-50 w-[320px] max-w-[calc(100vw-2rem)] rounded-[32px] bg-white p-6 shadow-xl sm:right-0">
          <GuestSelector adults={searchData.adults} onChange={onGuestChange} />
        </div>
      )}
    </>
  );
};

const GuestSelector = ({
  adults,
  onChange,
}: {
  adults: number;
  onChange: (value: number) => void;
}) => (
  <div className="flex items-center justify-between py-4">
    <div>
      <h3 className="text-base font-medium">Adults</h3>
      <p className="text-sm text-gray-500">Ages 13 or above</p>
    </div>
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(0, adults - 1))}
        disabled={adults === 0}
        className={`h-8 w-8 rounded-full border transition-all ${
          adults === 0
            ? 'cursor-not-allowed border-gray-200 text-gray-300'
            : 'border-gray-300 text-gray-600 hover:border-gray-900'
        }`}
      >
        <Minus size={14} className="mx-auto" />
      </button>
      <span className="min-w-[3rem] text-center text-base">{adults}</span>
      <button
        onClick={() => onChange(adults + 1)}
        className="h-8 w-8 rounded-full border border-gray-300 text-gray-600 transition-all hover:border-gray-900"
      >
        <Plus size={14} className="mx-auto" />
      </button>
    </div>
  </div>
);

export default SearchBar;

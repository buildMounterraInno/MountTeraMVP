import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import React from 'react';

type SearchSection = 'where' | 'from' | 'who' | null;

interface SearchData {
  destination: string;
  fromDate?: Date;
  adults: number;
}

const baseButtonStyle = 'relative cursor-pointer transition-all';
const activeButtonStyle = 'bg-blue-500';
const hoverButtonStyle = 'hover:bg-gray-100';
const roundedStyle = 'rounded-[32px]';

const SearchBar = () => {
  const [activeSection, setActiveSection] = useState<SearchSection>(null);
  const [searchData, setSearchData] = useState<SearchData>({
    destination: '',
    fromDate: undefined,
    adults: 0,
  });
  const searchRef = useRef<HTMLDivElement>(null);

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
    console.log({
      destination: searchData.destination,
      from: searchData.fromDate,
      adults: searchData.adults,
    });
  }, [searchData]);

  return (
    <div
      ref={searchRef}
      className="relative mx-auto w-full max-w-[850px] px-4 sm:px-6"
    >
      {/* Desktop Search Bar */}
      <div className="hidden items-center rounded-full bg-white shadow-md transition-shadow hover:shadow-lg md:flex">
        {/* Where */}
        <SectionButton
          isActive={activeSection === 'where'}
          className="mr-2 flex-grow px-7 py-3 text-left"
          onClick={() => setActiveSection('where')}
        >
          <SearchField
            label="Where"
            value={searchData.destination}
            placeholder="Search destinations"
            onChange={(value) =>
              setSearchData((prev) => ({ ...prev, destination: value }))
            }
          />
        </SectionButton>

        <Divider />

        {/* From Date */}
        <SectionButton
          isActive={activeSection === 'from'}
          className="mx-2 px-6 py-3"
          onClick={() => setActiveSection('from')}
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
          onClick={() => setActiveSection('who')}
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
          onClick={() => setActiveSection('where')}
          className="flex w-full items-center gap-4 rounded-full border border-gray-200 bg-white px-6 py-4 shadow-md"
        >
          <Search size={20} className="text-gray-600" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-800">Where to?</p>
            <p className="text-xs text-gray-500">
              Anywhere • Any week • Add guests
            </p>
          </div>
        </button>
      </div>

      {/* Dropdowns */}
      <Dropdowns
        activeSection={activeSection}
        searchData={searchData}
        onDateSelect={(fromDate) =>
          setSearchData((prev) => ({ ...prev, fromDate }))
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
  const containsButton = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === SearchButton
  );

  const Component = containsButton ? 'div' : 'button';

  return (
    <Component
      onClick={onClick}
      className={`${baseButtonStyle} ${className} ${
        isActive ? activeButtonStyle : hoverButtonStyle
      } ${className.includes('rounded') ? '' : roundedStyle}`}
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
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-800">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-0.5 w-full border-none bg-transparent text-sm text-gray-600 placeholder-gray-600 outline-none"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
);

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
      className="bg-primary flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:bg-[#E31E56]"
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
  const isDatePickerOpen = activeSection === 'from';

  return (
    <>
      {isDatePickerOpen && (
        <div className="absolute z-10 mt-2 translate-x-25 rounded-[32px] bg-white p-4 shadow-xl">
          <DayPicker
            animate
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

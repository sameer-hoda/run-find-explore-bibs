import React from 'react';

interface CitySelectorProps {
  cities: string[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ cities, selectedCity, onSelectCity }) => {
  // 'All' is handled by checking if selectedCity is empty or 'All' in the parent, 
  // but here we want to display 'All' as an option.
  // Assuming the parent passes 'All' or empty string when no specific city is selected.
  const displaySelectedCity = selectedCity || 'All';
  const allOptions = ['All', ...cities];

  return (
    <div className="w-full overflow-hidden">
      <div className="flex space-x-2 sm:space-x-3 overflow-x-auto scrollbar-hide pb-1 sm:pb-2 snap-x px-1">
        {allOptions.map((city) => {
          const isSelected = displaySelectedCity === city;
          return (
            <button
              key={city}
              onClick={() => onSelectCity(city === 'All' ? '' : city)}
              className={`
                snap-start shrink-0 px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 transform
                ${isSelected 
                  ? 'bg-[#FC4C02] text-white shadow-lg shadow-orange-200/50 scale-100' 
                  : 'bg-white text-slate-600 border border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              {city}
            </button>
          );
        })}
      </div>
    </div>
  );
};

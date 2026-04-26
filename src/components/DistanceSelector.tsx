import React from 'react';

interface DistanceSelectorProps {
    distances: string[];
    selectedDistance: string;
    onSelectDistance: (dist: string) => void;
}

export const DistanceSelector: React.FC<DistanceSelectorProps> = ({ distances, selectedDistance, onSelectDistance }) => {
    // Similar logic for 'All'
    const displaySelectedDistance = selectedDistance || 'All';
    const allOptions = ['All', ...distances];

    return (
        <div className="w-full overflow-hidden">
            <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto scrollbar-hide px-1 pb-1">
                {allOptions.map((dist) => {
                    const isSelected = displaySelectedDistance === dist;
                    return (
                        <button
                            key={dist}
                            onClick={() => onSelectDistance(dist === 'All' ? '' : dist)}
                            className={`
                shrink-0 px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold uppercase tracking-wide transition-all duration-200
                ${isSelected
                                    ? 'bg-[#FFF1E7] text-[#FC4C02] ring-1 ring-[#FC4C02]'
                                    : 'bg-transparent text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200 hover:bg-white/50'
                                }
              `}
                        >
                            {dist}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

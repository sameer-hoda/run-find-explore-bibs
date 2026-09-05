
import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  ArrowRight
} from "lucide-react";
import {
  Event,
  formatEventDate,
  getActiveDistances,
  getLocationDisplay,
  slugify
} from "@/services/eventService";
import { trackEvent } from "@/lib/analytics";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const {
    event_name,
    event_date,
    location,
    distances,
  } = event;

  const activeDistances = getActiveDistances(distances);

  // Logic from reference to show primary + others
  const primaryDistance = activeDistances[activeDistances.length - 1];
  const otherDistances = activeDistances.slice(0, activeDistances.length - 1);

  // Date formatting logic from reference
  const dateObj = event_date ? new Date(event_date.replace(/(\d+)(st|nd|rd|th)/, '$1').split(',')[0]) : new Date();
  const isValidDate = !isNaN(dateObj.getTime());

  const month = isValidDate ? new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj) : 'TBD';
  const day = isValidDate ? new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(dateObj) : '--';
  const weekday = isValidDate ? new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj) : '';

  const eventSlug = slugify(event_name);

  return (
    <a href={event.event_url} target="_blank" rel="noopener noreferrer" className="block h-full" onClick={() => trackEvent("registration_click", { event_name, event_date, city: getLocationDisplay(location), source: "card" })}>
      <article
        className="group relative bg-white rounded-2xl sm:rounded-3xl border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex items-stretch h-full"
        itemScope
        itemType="https://schema.org/Event"
      >
        {/* Left Column: Calendar Tile */}
        <div className="w-[60px] sm:w-[72px] bg-[#FFF1E7]/60 flex flex-col items-center justify-center border-r border-[#FC4C02]/10 shrink-0 py-3 sm:py-4 transition-colors group-hover:bg-[#FFF1E7]">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase text-[#FC4C02] tracking-wider leading-none mb-0.5 sm:mb-1">{month}</span>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 leading-none mb-0.5 sm:mb-1">{day}</span>
          <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 uppercase leading-none">{weekday}</span>
        </div>

        {/* Right Column: Main Content */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center relative min-w-0">
          {/* Decorative gradient blob on hover */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-[#FC4C02]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Row 1: Title & Arrow */}
          <div className="flex justify-between items-start gap-2 sm:gap-3 mb-0.5 z-10">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight group-hover:text-[#FC4C02] transition-colors line-clamp-2" itemProp="name">
              {event_name}
            </h3>
            <div className="text-slate-300 group-hover:text-[#FC4C02] group-hover:translate-x-1 transition-all duration-300 mt-0.5 shrink-0">
              <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>

          {/* Row 2: Location */}
          <div className="flex items-center text-slate-500 mb-2 sm:mb-3 z-10" itemProp="location" itemScope itemType="https://schema.org/Place">
            <MapPin size={12} className="mr-1 shrink-0 sm:w-[13px] sm:h-[13px]" strokeWidth={2.5} />
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 truncate" itemProp="address">
              {location.city}, {location.state || 'India'}
            </span>
          </div>

          {/* Row 3: Distances */}
          <div className="flex flex-wrap items-center gap-1.5 z-10 mt-auto">
            {activeDistances.length > 0 ? (
              activeDistances.map((dist, index) => (
                <span key={index} className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full whitespace-nowrap group-hover:border-[#FC4C02]/20 group-hover:bg-[#FFF1E7] group-hover:text-[#E34400] transition-colors">
                  {dist}
                </span>
              ))
            ) : (
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">
                See details
              </span>
            )}
          </div>
        </div>

        {/* Hidden SEO Meta */}
        <meta itemProp="startDate" content={event_date || ''} />
        <meta itemProp="eventStatus" content="https://schema.org/EventScheduled" />
        <meta itemProp="url" content={event.event_url} />
      </article>
    </a>
  );
};

export default EventCard;

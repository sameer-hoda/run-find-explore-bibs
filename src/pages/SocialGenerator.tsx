import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllEvents, Event, getActiveDistances } from '@/services/eventService';
import { MapPin, Calendar } from 'lucide-react';

const SocialGenerator: React.FC = () => {
    const [searchParams] = useSearchParams();
    const city = searchParams.get('city') || 'Mumbai';
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const loadEvents = async () => {
            const allEvents = await getAllEvents();
            console.log('Total events loaded:', allEvents.length);
            console.log('Filtering for city:', city);
            const cityEvents = allEvents
                .filter(e => {
                    if (!e.location.city) return false;
                    const match = e.location.city.trim().toLowerCase() === city.trim().toLowerCase();
                    if (match) console.log('Matched event:', e.event_name);
                    return match;
                })
                .sort((a, b) => {
                    const dateA = a.event_date ? new Date(a.event_date).getTime() : 0;
                    const dateB = b.event_date ? new Date(b.event_date).getTime() : 0;
                    return dateA - dateB;
                })
                .slice(0, 8); // Top 8 events to fit nicely
            console.log('Filtered events:', cityEvents.length);
            setEvents(cityEvents);
        };
        loadEvents();
    }, [city]);

    // Helper to format date nicely
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
            day: date.getDate(),
            weekday: date.toLocaleString('default', { weekday: 'short' })
        };
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10">
            {/* Instagram Portrait Container (1080x1350 scaled down for view) */}
            <div
                id="social-post"
                className="w-[1080px] h-[1350px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 relative overflow-hidden flex flex-col shadow-2xl scale-[0.5] origin-top text-white"
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                {/* Background Accents */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#FC4C02] opacity-10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-600 opacity-5 blur-[150px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

                {/* Header */}
                <div className="px-12 pt-16 pb-8 flex justify-between items-end relative z-10">
                    <div>
                        <p className="text-2xl font-bold text-[#FC4C02] tracking-[0.2em] uppercase mb-2">Upcoming Events</p>
                        <h1 className="text-[120px] font-black text-white leading-[0.9] tracking-tighter uppercase">
                            {city}
                        </h1>
                    </div>
                    <div className="flex flex-col items-end">
                        <img src="/mynextbib_logo.png" alt="mynextbib" className="h-16 w-auto brightness-0 invert opacity-80" />
                        <p className="text-slate-400 font-medium mt-2 tracking-wide">mynextbib.com</p>
                    </div>
                </div>

                {/* Event List */}
                <div className="flex-1 px-12 py-4 flex flex-col gap-5 relative z-10">
                    {events.map((event, index) => {
                        const { month, day, weekday } = formatDate(event.event_date);
                        const activeDistances = getActiveDistances(event.distances);
                        return (
                            <div key={index} className="bg-white/5 backdrop-blur-md rounded-[24px] p-5 flex items-center border border-white/10 shadow-lg">
                                {/* Date Tile */}
                                <div className="w-20 h-20 bg-gradient-to-br from-[#FC4C02] to-[#E34400] rounded-xl flex flex-col items-center justify-center shrink-0 mr-6 shadow-lg shadow-orange-900/20">
                                    <span className="text-xs font-bold text-white/90 tracking-wider leading-none mb-0.5">{month}</span>
                                    <span className="text-3xl font-black text-white leading-none mb-0.5">{day}</span>
                                    <span className="text-[10px] font-bold text-white/80 uppercase leading-none">{weekday}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-2xl font-bold text-white truncate mb-1.5 tracking-tight">{event.event_name}</h3>
                                    <div className="flex items-center gap-6 text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={18} className="text-[#FC4C02]" />
                                            <span className="text-lg font-medium">{event.location.city}</span>
                                        </div>
                                        <div className="h-1 w-1 bg-slate-600 rounded-full"></div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-medium text-slate-400">
                                                {activeDistances.join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="px-12 py-10 flex justify-between items-center relative z-10 mt-auto border-t border-white/5 bg-white/5 backdrop-blur-xl">
                    <p className="text-2xl font-medium text-slate-300">
                        Find your next race at <span className="text-white font-bold">mynextbib.com</span>
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-[#FC4C02] rounded-full animate-pulse"></div>
                        <p className="text-xl font-bold text-white tracking-wide">
                            LIVE CALENDAR
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialGenerator;

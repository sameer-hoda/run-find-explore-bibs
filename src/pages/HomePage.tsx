import React, { useState, useEffect, useMemo } from "react";
import { Event, getAllEvents, filterEvents, FilterCriteria, getUniqueCities } from "@/services/eventService";
import EventCard from "@/components/EventCard";
import { CitySelector } from "@/components/CitySelector";
import { DistanceSelector } from "@/components/DistanceSelector";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Search } from "lucide-react";
import { useEventContext } from "@/context/EventContext";
import { trackEvent } from "@/lib/analytics";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const HomePage: React.FC = () => {
  const { setFilteredEvents, setFilterCriteria } = useEventContext();
  // SSR seed: prerender.tsx sets __PRD_EVENTS__ before renderToString so the
  // homepage ships with content (SEO) instead of an empty shell.
  const getSeedEvents = (): Event[] | null => {
    const g = (globalThis as unknown as Record<string, unknown>).__PRD_EVENTS__;
    return Array.isArray(g) ? (g as Event[]) : null;
  };
  const [events, setEvents] = useState<Event[]>(() => getSeedEvents() ?? []);
  const [loading, setLoading] = useState<boolean>(() => getSeedEvents() === null);
  const [cities, setCities] = useState<string[]>(() => {
    const seed = getSeedEvents();
    if (!seed) return [];
    const counts: Record<string, number> = {};
    seed.forEach((e) => {
      const city = (e.location as unknown as { city?: string } | null)?.city;
      if (city) counts[city] = (counts[city] || 0) + 1;
    });
    return Object.keys(counts);
  });

  // Local state for the new selectors
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistance, setSelectedDistance] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 18; // 18 is a multiple of 2 and 3 for nice grids

  // Available distances for the selector
  const AVAILABLE_DISTANCES = ["5K", "10K", "21.1K", "42.2K"];

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [allEvents, uniqueCities] = await Promise.all([
          getAllEvents(),
          getUniqueCities()
        ]);
        setEvents(allEvents);
        setFilteredEvents(allEvents);
        setCities(uniqueCities);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [setFilteredEvents]);

  // Handle filter changes
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      setCurrentPage(1); // Reset to first page on filter change
      const filters: FilterCriteria = {
        city: selectedCity && selectedCity !== "All" ? [selectedCity] : undefined,
        distances: selectedDistance && selectedDistance !== "All" ? [selectedDistance] : undefined,
      };

      try {
        const filtered = await filterEvents(filters);
        setEvents(filtered);
        setFilteredEvents(filtered);
        setFilterCriteria(filters);
      } catch (error) {
        console.error("Error filtering events:", error);
      } finally {
        setLoading(false);
      }
    };

    applyFilters();
  }, [selectedCity, selectedDistance, setFilteredEvents, setFilterCriteria]);

  const handleResetFilters = () => {
    setSelectedCity("");
    setSelectedDistance("");
  };

  // Pagination logic
  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const currentEvents = events.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans text-slate-900 selection:bg-[#FC4C02] selection:text-white pb-20 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative pt-8 pb-6 sm:pt-16 sm:pb-12 px-4 text-center bg-gradient-to-b from-[#FFF6EF] to-transparent">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-2 sm:mb-4 leading-tight">
              Find Your <span className="text-[#FC4C02]">Next Run</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold tracking-wide uppercase">
              Curated Races • Across India • Updated Weekly
            </p>
          </div>
        </div>

        {/* Filters Container (Sticky) */}
        <div className="sticky top-12 sm:top-14 z-40 bg-[#F5F5F7]/95 backdrop-blur-md border-b border-black/5 shadow-sm transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center gap-2 relative group">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-16 shrink-0 hidden sm:block">Cities</span>
                {/* Fade masks for scrolling indication */}
                <div className="absolute left-16 top-0 bottom-0 w-4 bg-gradient-to-r from-[#F5F5F7] to-transparent z-10 pointer-events-none hidden sm:block"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F5F5F7] to-transparent z-10 pointer-events-none"></div>
                <CitySelector
                  cities={cities}
                  selectedCity={selectedCity}
                  onSelectCity={(city) => { trackEvent("city_filter", { city: city || "All" }); setSelectedCity(city); }}
                />
              </div>
              <div className="flex items-center gap-2 relative group">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-16 shrink-0 hidden sm:block">Distances</span>
                <div className="absolute left-16 top-0 bottom-0 w-4 bg-gradient-to-r from-[#F5F5F7] to-transparent z-10 pointer-events-none hidden sm:block"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F5F5F7] to-transparent z-10 pointer-events-none"></div>
                <DistanceSelector
                  distances={AVAILABLE_DISTANCES}
                  selectedDistance={selectedDistance}
                  onSelectDistance={(dist) => { trackEvent("distance_filter", { distance: dist || "All" }); setSelectedDistance(dist); }}
                />
              </div>
            </div>

            {/* Filter Summary */}
            <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-black/5 text-[10px] sm:text-xs font-medium text-slate-500 flex justify-between items-center">
              <span>
                Showing <strong className="text-slate-900">{events.length}</strong> events
                {selectedCity && selectedCity !== "All" && <span> in <strong className="text-slate-900">{selectedCity}</strong></span>}
                {selectedDistance && selectedDistance !== "All" && <span> • <strong className="text-slate-900">{selectedDistance}</strong></span>}
              </span>
              {(selectedCity || selectedDistance) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[#FC4C02] hover:text-[#E34400] transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 min-h-[50vh]">
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-[#FC4C02]" />
            </div>
          ) : events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 pb-12">
                {currentEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pb-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {/* Simple pagination logic for now: show current, prev, next, and ends */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page =>
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, index, array) => {
                          // Add ellipsis if there's a gap
                          const showEllipsis = index > 0 && page > array[index - 1] + 1;
                          return (
                            <React.Fragment key={page}>
                              {showEllipsis && (
                                <PaginationItem>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              )}
                              <PaginationItem>
                                <PaginationLink
                                  href="#"
                                  isActive={page === currentPage}
                                  onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          );
                        })}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
              <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No events found</h3>
              <p className="text-slate-500 max-w-xs mt-2 text-sm">
                We couldn't find any races matching those specific filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
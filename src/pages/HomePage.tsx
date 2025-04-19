
import React, { useState, useEffect } from "react";
import { getAllEvents, filterEvents, FilterCriteria, getUniqueCities } from "@/services/eventService";
import EventCard from "@/components/EventCard";
import FilterSidebar from "@/components/FilterSidebar";
import PageHeader from "@/components/PageHeader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { useEventContext } from "@/context/EventContext";

const HomePage: React.FC = () => {
  const { setFilteredEvents, setFilterCriteria } = useEventContext();
  const [events, setEvents] = useState(getAllEvents());
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<FilterCriteria>({});
  
  useEffect(() => {
    // Simulating API fetch
    const fetchEvents = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          const allEvents = getAllEvents();
          setEvents(allEvents);
          setFilteredEvents(allEvents);
          setCities(getUniqueCities());
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [setFilteredEvents]);
  
  const handleFilterChange = (filters: FilterCriteria) => {
    setLoading(true);
    setCurrentFilters(filters);
    
    setTimeout(() => {
      const filtered = filterEvents(filters);
      setEvents(filtered);
      setFilteredEvents(filtered);
      setFilterCriteria(filters);
      setLoading(false);
    }, 300);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterSidebar 
              onFilterChange={handleFilterChange} 
              cities={cities}
            />
          </div>
          
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {loading ? "Loading events..." : `${events.length} Events Found`}
              </h2>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-600 mb-2">No events found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters to find events
                </p>
                <button 
                  onClick={() => handleFilterChange({})} 
                  className="text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;

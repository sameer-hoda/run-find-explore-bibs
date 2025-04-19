
import React, { createContext, useContext, useState } from 'react';
import { Event, FilterCriteria } from '@/services/eventService';

interface EventContextType {
  filteredEvents: Event[];
  setFilteredEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  filterCriteria: FilterCriteria;
  setFilterCriteria: React.Dispatch<React.SetStateAction<FilterCriteria>>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({});

  return (
    <EventContext.Provider value={{ 
      filteredEvents, 
      setFilteredEvents,
      filterCriteria,
      setFilterCriteria
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

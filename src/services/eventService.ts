
// Define types based on our event data structure
export interface EventLocation {
  city: string | null;
  venue: string | null;
  state: string | null;
}

export interface EventDistances {
  "1K": boolean;
  "2K": boolean;
  "3K": boolean;
  "5K": boolean;
  "10K": boolean;
  "15K": boolean;
  "21.1K": boolean;
  "25K": boolean;
  "35K": boolean;
  "42.2K": boolean;
  "50K": boolean;
  "100K": boolean;
  other: boolean;
}

export interface EventCategory {
  name: string;
  distance: string;
  is_timed: boolean;
  registration_fee: number | null;
  age_restriction: string | null;
}

export interface EventInclusions {
  t_shirt: boolean;
  medal: boolean;
  timing_chip: boolean;
  bib: boolean;
  refreshments: boolean;
  e_certificate: boolean;
  goodie_bag: boolean;
}

export interface EventOrganizerInfo {
  name: string;
  contact: string | null;
}

export interface Event {
  id: string;
  event_name: string;
  event_date: string | null;
  location: EventLocation;
  event_type: "Physical" | "Virtual";
  distances: EventDistances;
  categories: EventCategory[];
  registration_closes: string | null;
  inclusions: EventInclusions;
  event_description: string;
  organizer_info: EventOrganizerInfo;
  event_url: string;
  // Added source_file and original_event_identifier based on prd.txt structure
  source_file?: string; 
  original_event_identifier?: string;
}

// --- Removed Mock events data ---

// Function to create a URL-friendly slug from a string
export const slugify = (text: string | null | undefined): string => {
  if (!text) {
    return '';
  }
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

// Cache for fetched events
let cachedEvents: Record<string, Event> | null = null;
let fetchPromise: Promise<Record<string, Event>> | null = null;

// Fetch events data from prd.txt
const fetchEvents = async (): Promise<Record<string, Event>> => {
  if (cachedEvents) {
    return cachedEvents;
  }
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const response = await fetch('/prd.txt');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const textData = await response.text();
      console.log("Fetched prd.txt content:", textData.substring(0, 500));
      const data: Record<string, Omit<Event, 'id'>> = JSON.parse(textData);
      
      // Add the id property to each event object
      const eventsWithId: Record<string, Event> = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const event = data[key];
          // Use the original key for the id, which is guaranteed to be unique
          const slugId = slugify(event.event_name); // Keep slug for URL generation if needed elsewhere
          eventsWithId[key] = { ...event, id: key }; // Use the unique key as the primary ID
        }
      }
      
      cachedEvents = eventsWithId;
      fetchPromise = null; // Clear promise after success
      console.log("Events loaded successfully:", Object.keys(cachedEvents).length);
      return cachedEvents;
    } catch (error) {
      console.error("Failed to fetch or parse events:", error);
      fetchPromise = null; // Clear promise on error
      cachedEvents = {}; // Set to empty object on error to prevent retries? Or handle differently?
      return {}; // Return empty object or throw error?
    }
  })();

  return fetchPromise;
};


// Get all events (now async)
export const getAllEvents = async (): Promise<Event[]> => {
  const events = await fetchEvents();
  return Object.values(events);
};

// Get event by ID (now async)
export const getEventById = async (id: string): Promise<Event | undefined> => {
  const events = await getAllEvents(); // Use getAllEvents to get the array
  // Find the event by the slugified id
  return events.find(event => event.id === id);
};

// Filter events based on criteria
export interface FilterCriteria {
  eventType?: "Physical" | "Virtual" | "All";
  distances?: string[];
  city?: string[]; // Changed to array
  inclusions?: (keyof EventInclusions)[];
  searchTerm?: string;
  ageRange?: string[]; // Changed to array
}

// Filter events based on criteria (now async)
export const filterEvents = async (criteria: FilterCriteria): Promise<Event[]> => {
  let allEvents = await getAllEvents(); // Await the async fetch

  // Filter out past events first
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the beginning of the day for accurate comparison

  let filteredEvents = allEvents.filter(event => {
    if (!event.event_date) return true; // Keep events with no date for now, or decide how to handle them
    
    // Clean the date string: remove ordinal suffixes (st, nd, rd, th)
    const cleanedDateString = event.event_date.replace(/(\d+)(st|nd|rd|th)/, '$1').split(',')[0];
    
    try {
      const eventDate = new Date(cleanedDateString); // Use the cleaned string
      // Check if eventDate is valid before comparing
      return !isNaN(eventDate.getTime()) && eventDate >= today;
    } catch (e) {
      console.error(`Invalid date format for event ${event.id}: ${event.event_date}`);
      return false; // Exclude events with invalid dates
    }
  });

  // Filter by event type
  if (criteria.eventType && criteria.eventType !== "All") {
    filteredEvents = filteredEvents.filter(
      (event) => event.event_type === criteria.eventType
    );
  }

  // Filter by distances
  if (criteria.distances && criteria.distances.length > 0) {
    filteredEvents = filteredEvents.filter((event) => {
      return criteria.distances?.some(
        (distance) => event.distances[distance as keyof EventDistances]
      );
    });
  }

  // Filter by city (multiple)
  if (criteria.city && criteria.city.length > 0) {
    filteredEvents = filteredEvents.filter(
      (event) => event.location.city && criteria.city!.includes(event.location.city)
    );
  }

  // Filter by inclusions
  if (criteria.inclusions && criteria.inclusions.length > 0) {
    filteredEvents = filteredEvents.filter((event) => {
      return criteria.inclusions?.every(
        (inclusion) => event.inclusions[inclusion]
      );
    });
  }

  // Filter by search term
  if (criteria.searchTerm) {
    const searchTermLower = criteria.searchTerm.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (event) =>
        event.event_name.toLowerCase().includes(searchTermLower) ||
        event.event_description.toLowerCase().includes(searchTermLower) ||
        event.organizer_info.name.toLowerCase().includes(searchTermLower) ||
        (event.location.city &&
          event.location.city.toLowerCase().includes(searchTermLower))
    );
  }

  // Filter by age range (Placeholder - requires specific logic based on age_restriction format)
  if (criteria.ageRange && criteria.ageRange.length > 0) {
    // Example: Assume ageRange is ["18-34", "35-49"] and age_restriction is "18+" or "Open to all"
    // You'll need to parse criteria.ageRange and compare against event.categories[*].age_restriction
    console.warn("Age range filtering not fully implemented yet. Checking against multiple selections.");
    // filteredEvents = filteredEvents.filter(event => checkAgeRange(event, criteria.ageRange)); // Pass array
  }

  // 3. Sort events chronologically (newest first)
  filteredEvents.sort((a, b) => {
    // Clean date strings before parsing for sorting
    const cleanDateA = a.event_date ? a.event_date.replace(/(\d+)(st|nd|rd|th)/, '$1') : null;
    const cleanDateB = b.event_date ? b.event_date.replace(/(\d+)(st|nd|rd|th)/, '$1') : null;

    const dateA = cleanDateA ? new Date(cleanDateA).getTime() : Infinity; // Place events without dates/invalid dates at the end
    const dateB = cleanDateB ? new Date(cleanDateB).getTime() : Infinity;

    // Handle potential NaN from invalid dates after cleaning (though cleaning should help)
    const timeA = isNaN(dateA) ? Infinity : dateA;
    const timeB = isNaN(dateB) ? Infinity : dateB;
    
    if (timeA === Infinity && timeB === Infinity) return 0; // Keep original order if both have no/invalid date
    if (timeA === Infinity) return 1; // a goes after b
    if (timeB === Infinity) return -1; // b goes after a

    return timeA - timeB; // Sort ascending (closest date first)
  });


  return filteredEvents;
};

// Get unique cities from all events, sorted by event count (now async)
export const getUniqueCities = async (): Promise<string[]> => {
  const allEvents = await getAllEvents(); // Await the async fetch
  
  // Count occurrences of each city
  const cityCounts: Record<string, number> = {};
  allEvents.forEach((event) => {
    if (event.location.city) {
      cityCounts[event.location.city] = (cityCounts[event.location.city] || 0) + 1;
    }
  });

  // Get unique city names
  const uniqueCities = Object.keys(cityCounts);

  // Sort cities by count (descending)
  uniqueCities.sort((a, b) => cityCounts[b] - cityCounts[a]);

  return uniqueCities;
};

// Get unique cities with counts, sorted by count (now async)
export const getCitiesWithCounts = async (): Promise<{ city: string; count: number }[]> => {
  const allEvents = await getAllEvents(); // Await the async fetch
  
  // Count occurrences of each city
  const cityCounts: Record<string, number> = {};
  allEvents.forEach((event) => {
    if (event.location.city) {
      cityCounts[event.location.city] = (cityCounts[event.location.city] || 0) + 1;
    }
  });

  // Convert to array of objects
  const citiesWithCounts = Object.entries(cityCounts).map(([city, count]) => ({ city, count }));

  // Sort cities by count (descending)
  citiesWithCounts.sort((a, b) => b.count - a.count);

  return citiesWithCounts;
};


// Format date or return placeholder
export const formatEventDate = (dateString: string | null): string => {
  if (!dateString) return "Date TBD";
  
  // Clean the date string: remove ordinal suffixes (st, nd, rd, th) and time part
  const cleanedDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, '$1').split(',')[0];
  
  const date = new Date(cleanedDateString); // Use the cleaned string

  // Check if the date is valid after parsing
  if (isNaN(date.getTime())) {
    console.error(`Invalid date format encountered in formatEventDate: ${dateString}`);
    return "Invalid Date"; 
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Get location display string
export const getLocationDisplay = (location: EventLocation): string => {
  if (location.venue && location.city) {
    return `${location.venue}, ${location.city}`;
  } else if (location.city) {
    return location.city;
  } else {
    return "Location TBD";
  }
};

// Get active distances as array
export const getActiveDistances = (distances: EventDistances): string[] => {
  return Object.entries(distances)
    .filter(([_, isActive]) => isActive)
    .map(([distance]) => distance);
};

// Convert distance key to display name
export const getDistanceDisplay = (distanceKey: string): string => {
  return distanceKey === "other" ? "Other" : distanceKey;
};

// Get color class for distance badge
export const getDistanceColorClass = (distance: string): string => {
  const key = distance.replace(".", "").toLowerCase();
  
  switch(key) {
    case "1k": return "bg-run-1k text-orange-950";
    case "2k": return "bg-run-2k text-orange-950";
    case "3k": return "bg-run-3k text-orange-950";
    case "5k": return "bg-run-5k text-white";
    case "10k": return "bg-run-10k text-white";
    case "15k": return "bg-run-15k text-white";
    case "21k": 
    case "211k": return "bg-run-21k text-white";
    case "25k": return "bg-run-25k text-white";
    case "35k": return "bg-run-35k text-white";
    case "42k": 
    case "422k": return "bg-run-42k text-white";
    case "50k": return "bg-run-50k text-white";
    case "100k": return "bg-run-100k text-white";
    default: return "bg-gray-200 text-gray-800";
  }
};

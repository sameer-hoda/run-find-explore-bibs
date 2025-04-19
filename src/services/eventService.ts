
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
}

// Mock events data
export const events: Record<string, Event> = {
  "unknown_event_-7327850053345349474": {
    id: "unknown_event_-7327850053345349474",
    event_name: "Pune Virtual Challenge",
    event_date: null,
    location: {
      city: "Pune",
      venue: null,
      state: null
    },
    event_type: "Virtual",
    distances: {
      "1K": false,
      "2K": false,
      "3K": false,
      "5K": true,
      "10K": true,
      "15K": false,
      "21.1K": true,
      "25K": false,
      "35K": false,
      "42.2K": true,
      "50K": false,
      "100K": false,
      "other": false
    },
    categories: [
      {
        name: "5KM",
        distance: "5K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      },
      {
        name: "10KM",
        distance: "10K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      },
      {
        name: "21KM",
        distance: "21.1K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      },
      {
        name: "42KM",
        distance: "42.2K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      }
    ],
    registration_closes: null,
    inclusions: {
      t_shirt: false,
      medal: true,
      timing_chip: false,
      bib: false,
      refreshments: false,
      e_certificate: false,
      goodie_bag: false
    },
    event_description: "Run / Walk / Jog / Cycle at your own Place, Gym, Treadmill or any other Marathon Event. Once your Challenge is done your Medal is sent by Courier. Run / Walk or Cycle at your own Place and share screenshot of Timing app on whatsapp number 8097712656.",
    organizer_info: {
      name: "Omega Events",
      contact: "8097712656"
    },
    event_url: "https://www.townscript.com/e/pune-virtual-challenge-220201"
  },
  "unknown_event_5207798823041033372": {
    id: "unknown_event_5207798823041033372",
    event_name: "Vrukshathon - Half Marathon 2025",
    event_date: "2025-06-01",
    location: {
      city: "Pune",
      venue: "Police Ground Shivaji Nagar",
      state: null
    },
    event_type: "Physical",
    distances: {
      "1K": false,
      "2K": false,
      "3K": true,
      "5K": true,
      "10K": true,
      "15K": false,
      "21.1K": true,
      "25K": false,
      "35K": false,
      "42.2K": false,
      "50K": false,
      "100K": false,
      "other": false
    },
    categories: [
      {
        name: "21k Half Marathon (Eco-Endurance - Competitive Run)",
        distance: "21.1K",
        is_timed: true,
        registration_fee: null,
        age_restriction: "Participants must be at least 16 years of age"
      },
      {
        name: "10k Run (The Green Sprint - Competitive Run)",
        distance: "10K",
        is_timed: true,
        registration_fee: null,
        age_restriction: "Participants must be at least 16 years of age"
      },
      {
        name: "5k Run (Nature's Dream Run)",
        distance: "5K",
        is_timed: false,
        registration_fee: null,
        age_restriction: null
      },
      {
        name: "3k Fun Walk (Kids & Senior Citizens)",
        distance: "3K",
        is_timed: false,
        registration_fee: null,
        age_restriction: null
      }
    ],
    registration_closes: null,
    inclusions: {
      t_shirt: true,
      medal: true,
      timing_chip: true,
      bib: true,
      refreshments: true,
      e_certificate: false,
      goodie_bag: true
    },
    event_description: "Vrukshathon 2025 is a Half-Marathon, a premier event conceptualised and organised by FITNESS FIRST INDIA and the Pune Forest and Police Department. We aim to promote healthy lifestyles, spread environmental consciousness, and create a memorable running experience for all participants.",
    organizer_info: {
      name: "FITNESS FIRST INDIA and the Pune Forest and Police Department",
      contact: null
    },
    event_url: "https://www.townscript.com/e/vrukshathon2025"
  },
  "unknown_event_-601324126198545053": {
    id: "unknown_event_-601324126198545053",
    event_name: "Major Dhyan Chand Virtual Marathon",
    event_date: null,
    location: {
      city: null,
      venue: null,
      state: null
    },
    event_type: "Virtual",
    distances: {
      "1K": false,
      "2K": false,
      "3K": false,
      "5K": true,
      "10K": true,
      "15K": false,
      "21.1K": true,
      "25K": false,
      "35K": false,
      "42.2K": true,
      "50K": false,
      "100K": false,
      "other": false
    },
    categories: [
      {
        name: "5 km",
        distance: "5K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      },
      {
        name: "10 km",
        distance: "10K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      },
      {
        name: "21 km",
        distance: "21.1K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      },
      {
        name: "42 km",
        distance: "42.2K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      }
    ],
    registration_closes: null,
    inclusions: {
      t_shirt: false,
      medal: true,
      timing_chip: false,
      bib: false,
      refreshments: false,
      e_certificate: false,
      goodie_bag: false
    },
    event_description: "Get \"Major Dhyan Chand Tribute Medal\" by Courier. Distance Categories - 5 km / 10 km / 21 km / 42 km Run is to Promote Fitness and Legacy of Major Dhyan Chand.",
    organizer_info: {
      name: "Omega Events",
      contact: "8097712656"
    },
    event_url: "https://www.townscript.com/e/copy-of-major-dhyan-chand-312111"
  },
  "unknown_event_4155110914854834589": {
    id: "unknown_event_4155110914854834589",
    event_name: "Hercules Virtual Marathon / Cyclothon",
    event_date: null,
    location: {
      city: null,
      venue: null,
      state: null
    },
    event_type: "Virtual",
    distances: {
      "1K": false,
      "2K": false,
      "3K": false,
      "5K": true,
      "10K": true,
      "15K": false,
      "21.1K": true,
      "25K": false,
      "35K": false,
      "42.2K": true,
      "50K": false,
      "100K": false,
      "other": false
    },
    categories: [
      {
        name: "5 KM",
        distance: "5K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      },
      {
        name: "10 KM",
        distance: "10K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      },
      {
        name: "21 KM",
        distance: "21.1K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      },
      {
        name: "42 KM",
        distance: "42.2K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      }
    ],
    registration_closes: null,
    inclusions: {
      t_shirt: false,
      medal: true,
      timing_chip: false,
      bib: false,
      refreshments: false,
      e_certificate: false,
      goodie_bag: false
    },
    event_description: "Run / Walk / Jog / Cycle at your own Place, Gym, Treadmill or any other Marathon Event. Get Medal by Courier. Run is to promote Fitness.",
    organizer_info: {
      name: "Omega Events",
      contact: "8097712656"
    },
    event_url: "https://www.townscript.com/e/virtual-marathon6"
  },
  "unknown_event_-7322174064500020992": {
    id: "unknown_event_-7322174064500020992",
    event_name: "Unicorn Virtual Marathon",
    event_date: null,
    location: {
      city: null,
      venue: null,
      state: null
    },
    event_type: "Virtual",
    distances: {
      "1K": false,
      "2K": false,
      "3K": false,
      "5K": true,
      "10K": true,
      "15K": false,
      "21.1K": true,
      "25K": false,
      "35K": false,
      "42.2K": true,
      "50K": false,
      "100K": false,
      "other": false
    },
    categories: [
      {
        name: "5 KM",
        distance: "5K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      },
      {
        name: "10 KM",
        distance: "10K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      },
      {
        name: "21 KM",
        distance: "21.1K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      },
      {
        name: "42 KM",
        distance: "42.2K",
        is_timed: true,
        registration_fee: null,
        age_restriction: null
      }
    ],
    registration_closes: null,
    inclusions: {
      t_shirt: false,
      medal: false,
      timing_chip: false,
      bib: false,
      refreshments: false,
      e_certificate: false,
      goodie_bag: false
    },
    event_description: "Trophy for all Participants. Categories - 5 KM / 10 KM / 21 KM / 42 KM (Distance can be completed in one day or in multiple days as per your practice) You can do Walking, Running or Cycling. Trophy will have Your Name and Distance Covered. Once your Challenge is done your Trophy is sent by Courier. Trophy Size - 22 cm.",
    organizer_info: {
      name: "Omega Events",
      contact: "8097712656"
    },
    event_url: "https://www.townscript.com/e/unicorn-challenge-get-trophy-by-courier-443023"
  }
};

// Get all events
export const getAllEvents = (): Event[] => {
  return Object.values(events);
};

// Get event by ID
export const getEventById = (id: string): Event | undefined => {
  return events[id];
};

// Filter events based on criteria
export interface FilterCriteria {
  eventType?: "Physical" | "Virtual" | "All";
  distances?: string[];
  city?: string;
  inclusions?: (keyof EventInclusions)[];
  searchTerm?: string;
}

export const filterEvents = (criteria: FilterCriteria): Event[] => {
  let filteredEvents = getAllEvents();

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

  // Filter by city
  if (criteria.city) {
    filteredEvents = filteredEvents.filter(
      (event) => event.location.city === criteria.city
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

  return filteredEvents;
};

// Get unique cities from all events
export const getUniqueCities = (): string[] => {
  const cities = getAllEvents()
    .map((event) => event.location.city)
    .filter((city): city is string => city !== null);
  
  return Array.from(new Set(cities));
};

// Format date or return placeholder
export const formatEventDate = (dateString: string | null): string => {
  if (!dateString) return "Date TBD";
  
  const date = new Date(dateString);
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

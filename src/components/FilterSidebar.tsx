import React, { useState, useEffect, useCallback } from "react"; // Added useCallback for debounce cleanup
import {
  Filter,
  MapPin,
  Medal,
  Timer,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// Removed Input import as Search is removed
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// Import the canonical FilterCriteria type
import { FilterCriteria } from "@/services/eventService";
// Removed debounce import and EventInclusions

interface FilterSidebarProps {
  onFilterChange: (filters: FilterCriteria) => void; // Use imported FilterCriteria
  cities: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, cities }) => {
  // Removed searchTerm state
  const [eventType, setEventType] = useState<"All" | "Physical" | "Virtual">("All");
  const [selectedDistances, setSelectedDistances] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]); // Changed state name and type to array
  // Removed selectedAgeRanges state
  // Removed selectedInclusions state
  const [isOpen, setIsOpen] = useState(false);

  // Function to apply all current filters
  const applyFilters = useCallback(() => {
    const filters: FilterCriteria = {
      eventType: eventType === "All" ? undefined : eventType,
      distances: selectedDistances.length > 0 ? selectedDistances : undefined,
      city: selectedCities.length > 0 ? selectedCities : undefined, // Use array state
      // Removed ageRange filter
      // Removed inclusions filter
      // Removed searchTerm filter
    };
    onFilterChange(filters);
  }, [eventType, selectedDistances, selectedCities, onFilterChange]); // Updated dependencies


  // Debounced effect to apply filters
  useEffect(() => {
    // Set a timer to apply filters after 500ms of inactivity
    const handler = setTimeout(() => {
      applyFilters();
    }, 500); // Adjust debounce time as needed (e.g., 300-500ms)

    // Cleanup function to clear the timeout if filters change again before 500ms
    return () => {
      clearTimeout(handler);
    };
    // Rerun the effect if any filter criteria or the callback changes
  }, [eventType, selectedDistances, selectedCities, applyFilters]); // applyFilters is now stable due to useCallback


  // Removed search handlers: handleSearchChange, handleSearchKeyDown, handleSearchBlur


  const handleEventTypeChange = (value: "All" | "Physical" | "Virtual") => {
    setEventType(value);
  };

  const handleDistanceChange = (distance: string) => {
    setSelectedDistances(prev =>
      prev.includes(distance)
        ? prev.filter(d => d !== distance)
        : [...prev, distance]
    );
  };

  const handleCityChange = (city: string) => {
    setSelectedCities(prev =>
      prev.includes(city)
        ? prev.filter(c => c !== city) // Remove city if already selected
        : [...prev, city] // Add city if not selected
    );
  };

  // Removed handleAgeRangeChange
  // Removed handleInclusionChange

  const resetFilters = () => {
    // Removed setSearchTerm
    setEventType("All");
    setSelectedDistances([]);
    setSelectedCities([]); // Reset array
    // Removed setSelectedAgeRanges
    // Removed setSelectedInclusions
    // Let useEffect trigger the onFilterChange with cleared state
  };


  const toggleMobileFilters = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="lg:hidden w-full p-4 bg-white shadow-sm sticky top-0 z-10">
        <Button
          onClick={toggleMobileFilters}
          variant="outline"
          className="w-full flex justify-between items-center"
        >
          <span className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className={`
        lg:block
        ${isOpen ? 'block' : 'hidden'}
        lg:sticky lg:top-4
        bg-white
        rounded-lg
        shadow-sm
        p-4
        lg:p-6
        overflow-auto
        max-h-[calc(100vh-2rem)]
      `}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs"
          >
            Reset
          </Button>
        </div>

        <div className="space-y-6">
          {/* Search Section Removed */}

          {/* Event Type */}
          <div className="filter-section">
            <Label className="filter-label">
              <Tag className="h-4 w-4 inline mr-2" />
              Event Type
            </Label>
            <RadioGroup
              value={eventType}
              onValueChange={(value) => handleEventTypeChange(value as "All" | "Physical" | "Virtual")}
              className="mt-1 space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="All" id="all" />
                <Label htmlFor="all" className="cursor-pointer">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Physical" id="physical" />
                <Label htmlFor="physical" className="cursor-pointer">Physical</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Virtual" id="virtual" />
                <Label htmlFor="virtual" className="cursor-pointer">Virtual</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Distances */}
          <Accordion type="single" collapsible className="filter-section w-full">
            <AccordionItem value="distances" className="border-none">
              <AccordionTrigger className="py-0 filter-label">
                <div className="flex items-center">
                  <Timer className="h-4 w-4 mr-2" />
                  Distances
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="flex flex-wrap gap-2">
                  {["1K", "2K", "3K", "5K", "10K", "15K", "21.1K", "25K", "35K", "42.2K", "50K", "100K", "Other"].map((distance) => (
                    <Badge
                      key={distance}
                      variant={selectedDistances.includes(distance) ? "default" : "outline"}
                      onClick={() => handleDistanceChange(distance)}
                      className="cursor-pointer transition-colors hover:bg-accent"
                    >
                      {distance}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          {/* Cities */}
          {cities.length > 0 && (
            <>
              <Accordion type="single" collapsible className="filter-section w-full">
                <AccordionItem value="cities" className="border-none">
                  <AccordionTrigger className="py-0 filter-label">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Cities
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="flex flex-wrap gap-2">
                      {cities.map((city) => (
                        <Badge
                          key={city}
                          variant={selectedCities.includes(city) ? "default" : "outline"} // Check if included in array
                          onClick={() => handleCityChange(city)}
                          className="cursor-pointer transition-colors hover:bg-accent"
                        >
                          {city}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Separator />
            </>
          )}

          {/* Age Ranges Section Removed */}

          {/* Inclusions Section Removed */}

        </div>
      </div>
    </>
  );
};

export default FilterSidebar;

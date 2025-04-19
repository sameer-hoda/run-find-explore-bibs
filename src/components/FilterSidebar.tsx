
import React, { useState } from "react";
import { 
  Calendar, 
  Filter, 
  MapPin, 
  Medal, 
  Search, 
  Shirt, 
  Timer, 
  User, 
  Tag, 
  Coffee, 
  FileBadge, 
  ShoppingBag,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FilterCriteria } from "@/services/eventService";

interface FilterSidebarProps {
  onFilterChange: (filters: FilterCriteria) => void;
  cities: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, cities }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventType, setEventType] = useState<"All" | "Physical" | "Virtual">("All");
  const [selectedDistances, setSelectedDistances] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
    setSelectedCity(prev => prev === city ? "" : city);
  };

  const handleInclusionChange = (inclusion: string) => {
    setSelectedInclusions(prev => 
      prev.includes(inclusion) 
        ? prev.filter(i => i !== inclusion) 
        : [...prev, inclusion]
    );
  };

  const applyFilters = () => {
    onFilterChange({
      eventType,
      distances: selectedDistances,
      city: selectedCity || undefined,
      inclusions: selectedInclusions as any[],
      searchTerm: searchTerm || undefined
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setEventType("All");
    setSelectedDistances([]);
    setSelectedCity("");
    setSelectedInclusions([]);
    onFilterChange({});
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
          {/* Search */}
          <div className="filter-section">
            <Label htmlFor="search" className="filter-label">
              <Search className="h-4 w-4 inline mr-2" />
              Search
            </Label>
            <Input
              id="search"
              placeholder="Event name, organizer, etc."
              value={searchTerm}
              onChange={handleSearchChange}
              className="mt-1"
            />
          </div>
          
          <Separator />
          
          {/* Event Type */}
          <div className="filter-section">
            <Label className="filter-label">
              <Tag className="h-4 w-4 inline mr-2" />
              Event Type
            </Label>
            <RadioGroup
              value={eventType}
              onValueChange={(value) => handleEventTypeChange(value as any)}
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
              <AccordionContent className="pt-2 space-y-1">
                {["1K", "2K", "3K", "5K", "10K", "15K", "21.1K", "25K", "35K", "42.2K", "50K", "100K"].map((distance) => (
                  <div key={distance} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`distance-${distance}`} 
                      checked={selectedDistances.includes(distance)}
                      onCheckedChange={() => handleDistanceChange(distance)}
                    />
                    <Label 
                      htmlFor={`distance-${distance}`}
                      className="cursor-pointer text-sm"
                    >
                      {distance}
                    </Label>
                  </div>
                ))}
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
                  <AccordionContent className="pt-2 space-y-1">
                    {cities.map((city) => (
                      <div key={city} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`city-${city}`} 
                          checked={selectedCity === city}
                          onCheckedChange={() => handleCityChange(city)}
                        />
                        <Label 
                          htmlFor={`city-${city}`}
                          className="cursor-pointer text-sm"
                        >
                          {city}
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Separator />
            </>
          )}
          
          {/* Inclusions */}
          <Accordion type="single" collapsible className="filter-section w-full">
            <AccordionItem value="inclusions" className="border-none">
              <AccordionTrigger className="py-0 filter-label">
                <div className="flex items-center">
                  <Medal className="h-4 w-4 mr-2" />
                  Inclusions
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 space-y-1">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="inclusion-t_shirt" 
                    checked={selectedInclusions.includes("t_shirt")}
                    onCheckedChange={() => handleInclusionChange("t_shirt")}
                  />
                  <Label htmlFor="inclusion-t_shirt" className="cursor-pointer text-sm">
                    <Shirt className="h-3 w-3 inline mr-1" /> T-shirt
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="inclusion-medal" 
                    checked={selectedInclusions.includes("medal")}
                    onCheckedChange={() => handleInclusionChange("medal")}
                  />
                  <Label htmlFor="inclusion-medal" className="cursor-pointer text-sm">
                    <Medal className="h-3 w-3 inline mr-1" /> Medal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="inclusion-timing_chip" 
                    checked={selectedInclusions.includes("timing_chip")}
                    onCheckedChange={() => handleInclusionChange("timing_chip")}
                  />
                  <Label htmlFor="inclusion-timing_chip" className="cursor-pointer text-sm">
                    <Timer className="h-3 w-3 inline mr-1" /> Timing Chip
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="inclusion-refreshments" 
                    checked={selectedInclusions.includes("refreshments")}
                    onCheckedChange={() => handleInclusionChange("refreshments")}
                  />
                  <Label htmlFor="inclusion-refreshments" className="cursor-pointer text-sm">
                    <Coffee className="h-3 w-3 inline mr-1" /> Refreshments
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="inclusion-e_certificate" 
                    checked={selectedInclusions.includes("e_certificate")}
                    onCheckedChange={() => handleInclusionChange("e_certificate")}
                  />
                  <Label htmlFor="inclusion-e_certificate" className="cursor-pointer text-sm">
                    <FileBadge className="h-3 w-3 inline mr-1" /> E-certificate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="inclusion-goodie_bag" 
                    checked={selectedInclusions.includes("goodie_bag")}
                    onCheckedChange={() => handleInclusionChange("goodie_bag")}
                  />
                  <Label htmlFor="inclusion-goodie_bag" className="cursor-pointer text-sm">
                    <ShoppingBag className="h-3 w-3 inline mr-1" /> Goodie Bag
                  </Label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <Separator />
          
          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;

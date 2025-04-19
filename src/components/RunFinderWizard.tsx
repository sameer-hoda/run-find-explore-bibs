
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Check, 
  HelpCircle, 
  MapPin, 
  Medal, 
  Ruler, 
  Shirt, 
  Timer, 
  User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterCriteria, Event, filterEvents } from "@/services/eventService";

interface RunFinderWizardProps {
  onComplete: (events: Event[], criteria: FilterCriteria) => void;
}

const RunFinderWizard: React.FC<RunFinderWizardProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState<"All" | "Physical" | "Virtual">("All");
  const [selectedDistances, setSelectedDistances] = useState<string[]>([]);
  const [age, setAge] = useState<string>("");
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");
  
  const handleDistanceChange = (distance: string) => {
    setSelectedDistances(prev => 
      prev.includes(distance) 
        ? prev.filter(d => d !== distance) 
        : [...prev, distance]
    );
  };
  
  const handleInclusionChange = (inclusion: string) => {
    setSelectedInclusions(prev => 
      prev.includes(inclusion) 
        ? prev.filter(i => i !== inclusion) 
        : [...prev, inclusion]
    );
  };
  
  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const findRuns = () => {
    const criteria: FilterCriteria = {
      eventType,
      distances: selectedDistances,
      city: location || undefined,
      inclusions: selectedInclusions as any[]
    };
    
    const matchedEvents = filterEvents(criteria);
    onComplete(matchedEvents, criteria);
    navigate('/results');
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Ruler className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">
                Preferred Distance
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 inline ml-2 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        For beginners, 5K is a good starting point. More experienced runners might prefer 10K or longer.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>
            </div>
            
            <p className="text-gray-500 text-sm">
              Select one or more distances you'd like to run:
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["1K", "2K", "3K", "5K", "10K", "15K", "21.1K", "25K", "35K", "42.2K", "50K", "100K"].map((distance) => (
                <div key={distance} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`wizard-distance-${distance}`} 
                    checked={selectedDistances.includes(distance)}
                    onCheckedChange={() => handleDistanceChange(distance)}
                  />
                  <Label 
                    htmlFor={`wizard-distance-${distance}`}
                    className="cursor-pointer"
                  >
                    {distance}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">
                Event Type & Location
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-500">Prefer virtual or physical events?</Label>
                <RadioGroup
                  value={eventType}
                  onValueChange={(value) => setEventType(value as any)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="All" id="wizard-all" />
                    <Label htmlFor="wizard-all" className="cursor-pointer">No preference</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Physical" id="wizard-physical" />
                    <Label htmlFor="wizard-physical" className="cursor-pointer">
                      Physical events only
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 inline ml-2 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Physical events take place at a specific venue on a specific date.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Virtual" id="wizard-virtual" />
                    <Label htmlFor="wizard-virtual" className="cursor-pointer">
                      Virtual events only
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 inline ml-2 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Virtual events can be completed anywhere, anytime within a specified period.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="wizard-location" className="text-sm text-gray-500">
                  Preferred location (optional):
                </Label>
                <Input
                  id="wizard-location"
                  placeholder="Enter city name"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">
                Age & Preferences
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="wizard-age" className="text-sm text-gray-500">
                  Your age (optional, for age-restricted events):
                </Label>
                <Input
                  id="wizard-age"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-1"
                  min="1"
                  max="120"
                />
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">
                  Which inclusions are important to you?
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="wizard-inclusion-t_shirt" 
                      checked={selectedInclusions.includes("t_shirt")}
                      onCheckedChange={() => handleInclusionChange("t_shirt")}
                    />
                    <Label htmlFor="wizard-inclusion-t_shirt" className="cursor-pointer">
                      <Shirt className="h-4 w-4 inline mr-1" /> T-shirt
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="wizard-inclusion-medal" 
                      checked={selectedInclusions.includes("medal")}
                      onCheckedChange={() => handleInclusionChange("medal")}
                    />
                    <Label htmlFor="wizard-inclusion-medal" className="cursor-pointer">
                      <Medal className="h-4 w-4 inline mr-1" /> Medal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="wizard-inclusion-timing_chip" 
                      checked={selectedInclusions.includes("timing_chip")}
                      onCheckedChange={() => handleInclusionChange("timing_chip")}
                    />
                    <Label htmlFor="wizard-inclusion-timing_chip" className="cursor-pointer">
                      <Timer className="h-4 w-4 inline mr-1" /> Timing Chip
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Find Your Perfect Run</CardTitle>
        <p className="text-gray-500">
          Answer a few questions to discover events that match your preferences
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex items-center justify-center h-8 w-8 rounded-full 
                ${
                  i < step
                    ? "bg-primary text-white"
                    : i === step
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i}
              </div>
            ))}
          </div>
          <div className="relative w-full h-2 bg-gray-100 rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        {renderStepContent()}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
        ) : (
          <div></div>
        )}
        
        {step < 3 ? (
          <Button onClick={nextStep} disabled={step === 1 && selectedDistances.length === 0}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={findRuns} variant="default">
            Find Runs
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RunFinderWizard;


import React from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  MapPin, 
  Medal, 
  Timer, 
  ShoppingBag, 
  Shirt, 
  Clock 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { 
  Event, 
  formatEventDate, 
  getActiveDistances, 
  getDistanceColorClass, 
  getLocationDisplay 
} from "@/services/eventService";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { 
    id, 
    event_name, 
    event_date, 
    location, 
    event_type, 
    distances, 
    inclusions 
  } = event;

  const activeDistances = getActiveDistances(distances);
  const locationDisplay = getLocationDisplay(location);
  const formattedDate = formatEventDate(event_date);
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge 
            variant={event_type === "Physical" ? "default" : "outline"}
            className="mb-2"
          >
            {event_type}
          </Badge>
          {event.registration_closes && (
            <Badge variant="secondary" className="text-xs">
              Closes: {formatEventDate(event.registration_closes)}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg font-bold line-clamp-2">
          {event_name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
          
          {locationDisplay !== "Location TBD" && (
            <div className="flex items-center text-gray-500">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="truncate">{locationDisplay}</span>
            </div>
          )}
          
          <div className="pt-2">
            <div className="text-xs font-medium text-gray-500 mb-1">Distances:</div>
            <div className="flex flex-wrap gap-1">
              {activeDistances.map((distance) => (
                <span 
                  key={distance} 
                  className={`distance-badge ${getDistanceColorClass(distance)}`}
                >
                  {distance}
                </span>
              ))}
            </div>
          </div>
          
          <div className="pt-1">
            <div className="text-xs font-medium text-gray-500 mb-1">Inclusions:</div>
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`${inclusions.medal ? "text-primary" : "text-gray-300"}`}>
                      <Medal className="inclusion-icon" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{inclusions.medal ? "Medal included" : "No medal"}</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`${inclusions.t_shirt ? "text-primary" : "text-gray-300"}`}>
                      <Shirt className="inclusion-icon" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{inclusions.t_shirt ? "T-shirt included" : "No t-shirt"}</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`${inclusions.timing_chip ? "text-primary" : "text-gray-300"}`}>
                      <Timer className="inclusion-icon" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{inclusions.timing_chip ? "Timing chip included" : "No timing chip"}</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`${inclusions.goodie_bag ? "text-primary" : "text-gray-300"}`}>
                      <ShoppingBag className="inclusion-icon" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{inclusions.goodie_bag ? "Goodie bag included" : "No goodie bag"}</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`${inclusions.refreshments ? "text-primary" : "text-gray-300"}`}>
                      <Clock className="inclusion-icon" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{inclusions.refreshments ? "Refreshments included" : "No refreshments"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/event/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;

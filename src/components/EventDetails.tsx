
import React from "react";
import { 
  Calendar, 
  MapPin, 
  Info, 
  Medal, 
  Timer, 
  Shirt, 
  Clock, 
  ShoppingBag, 
  User, 
  Check, 
  X, 
  ExternalLink, 
  FileBadge,
  Building,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Event, formatEventDate, getLocationDisplay } from "@/services/eventService";

interface EventDetailsProps {
  event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const { 
    event_name, 
    event_date, 
    location, 
    event_type, 
    categories, 
    inclusions, 
    event_description, 
    organizer_info, 
    event_url, 
    registration_closes 
  } = event;
  
  const formattedDate = formatEventDate(event_date);
  const locationDisplay = getLocationDisplay(location);
  const formattedClosingDate = formatEventDate(registration_closes);
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge 
            variant={event_type === "Physical" ? "default" : "outline"}
            className="mb-2"
          >
            {event_type}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold">{event_name}</h1>
          
          <div className="mt-2 space-y-2">
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formattedDate}</span>
            </div>
            
            {locationDisplay !== "Location TBD" && (
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{locationDisplay}</span>
              </div>
            )}
            
            {registration_closes && (
              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Registration closes: {formattedClosingDate}</span>
              </div>
            )}
          </div>
        </div>
        
        <Button asChild size="lg" className="mt-4 md:mt-0">
          <a href={event_url} target="_blank" rel="noopener noreferrer">
            Register <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Info className="h-5 w-5 mr-2" /> 
                Event Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{event_description}</p>
            </CardContent>
          </Card>
          
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Timer className="h-5 w-5 mr-2" /> 
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Timed</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Age Restriction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.distance}</TableCell>
                      <TableCell>
                        {category.is_timed ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        {category.registration_fee 
                          ? `₹${category.registration_fee}` 
                          : "Details on registration"}
                      </TableCell>
                      <TableCell>
                        {category.age_restriction || "No restrictions"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Organizer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Building className="h-5 w-5 mr-2" /> 
                Organizer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-medium">{organizer_info.name}</p>
                {organizer_info.contact ? (
                  <p className="text-gray-500 flex items-center mt-1">
                    <Phone className="h-4 w-4 mr-2" />
                    {organizer_info.contact}
                  </p>
                ) : (
                  <p className="text-gray-500 mt-1">Contact info not available</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Inclusions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Medal className="h-5 w-5 mr-2" /> 
                Inclusions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  {inclusions.t_shirt ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="flex items-center">
                    <Shirt className="h-4 w-4 mr-2" /> T-shirt
                  </span>
                </li>
                <li className="flex items-center">
                  {inclusions.medal ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="flex items-center">
                    <Medal className="h-4 w-4 mr-2" /> Medal
                  </span>
                </li>
                <li className="flex items-center">
                  {inclusions.timing_chip ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="flex items-center">
                    <Timer className="h-4 w-4 mr-2" /> Timing Chip
                  </span>
                </li>
                <li className="flex items-center">
                  {inclusions.bib ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-2" /> Bib
                  </span>
                </li>
                <li className="flex items-center">
                  {inclusions.refreshments ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" /> Refreshments
                  </span>
                </li>
                <li className="flex items-center">
                  {inclusions.e_certificate ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="flex items-center">
                    <FileBadge className="h-4 w-4 mr-2" /> E-certificate
                  </span>
                </li>
                <li className="flex items-center">
                  {inclusions.goodie_bag ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2" /> Goodie Bag
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Registration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <ExternalLink className="h-5 w-5 mr-2" /> 
                Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {registration_closes && (
                <p className="text-sm">
                  <span className="font-medium">Registration closes:</span> {formattedClosingDate}
                </p>
              )}
              <Button asChild className="w-full">
                <a href={event_url} target="_blank" rel="noopener noreferrer">
                  Register Now
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

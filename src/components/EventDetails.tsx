
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
import { trackEvent } from "@/lib/analytics";

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
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-4">
          <Badge
            variant={event_type === "Physical" ? "default" : "outline"}
            className="mb-2 bg-slate-900 text-white hover:bg-slate-800 border-none"
          >
            {event_type}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">{event_name}</h1>

          <div className="flex flex-col gap-2 text-slate-500 font-medium text-base">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3 text-[#FC4C02]" />
              <span>{formattedDate}</span>
            </div>

            {locationDisplay !== "Location TBD" && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-[#FC4C02]" />
                <span>{locationDisplay}</span>
              </div>
            )}

            {registration_closes && (
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-[#FC4C02]" />
                <span>Registration closes: {formattedClosingDate}</span>
              </div>
            )}
          </div>
        </div>

        <Button asChild size="lg" className="mt-4 md:mt-0 bg-[#FC4C02] hover:bg-[#E34400] text-white rounded-full px-8 py-6 text-lg font-bold shadow-lg shadow-orange-200/50 transition-all hover:scale-105">
          <a href={event_url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("registration_click", { event_name, event_date, city: locationDisplay, source: "details_button" })}>
            Register Now <ExternalLink className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </div>

      <Separator className="bg-slate-100" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
              <Info className="h-6 w-6 mr-2 text-slate-400" />
              About the Event
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
              <p className="whitespace-pre-line">{event_description}</p>
            </div>
          </section>

          {/* Categories */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
              <Timer className="h-6 w-6 mr-2 text-slate-400" />
              Race Categories
            </h2>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-900">Category</TableHead>
                    <TableHead className="font-bold text-slate-900">Distance</TableHead>
                    <TableHead className="font-bold text-slate-900">Timed</TableHead>
                    <TableHead className="font-bold text-slate-900">Fee</TableHead>
                    <TableHead className="font-bold text-slate-900">Age Limit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category, index) => (
                    <TableRow key={index} className="hover:bg-slate-50/50">
                      <TableCell className="font-semibold text-slate-900">{category.name}</TableCell>
                      <TableCell>{category.distance}</TableCell>
                      <TableCell>
                        {category.is_timed ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-slate-300" />
                        )}
                      </TableCell>
                      <TableCell>
                        {category.registration_fee
                          ? `₹${category.registration_fee}`
                          : "Check link"}
                      </TableCell>
                      <TableCell>
                        {category.age_restriction || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Organizer */}
          <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
              <Building className="h-5 w-5 mr-2 text-slate-400" />
              Organizer
            </h3>
            <div className="space-y-2">
              <p className="font-semibold text-slate-700">{organizer_info.name}</p>
              {organizer_info.contact && (
                <p className="text-slate-500 flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  {organizer_info.contact}
                </p>
              )}
            </div>
          </section>

          {/* Inclusions */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Medal className="h-5 w-5 mr-2 text-slate-400" />
              What's Included
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { key: 't_shirt', label: 'T-shirt', icon: Shirt },
                { key: 'medal', label: 'Medal', icon: Medal },
                { key: 'timing_chip', label: 'Timing Chip', icon: Timer },
                { key: 'bib', label: 'Bib', icon: User },
                { key: 'refreshments', label: 'Refreshments', icon: Clock },
                { key: 'e_certificate', label: 'E-certificate', icon: FileBadge },
                { key: 'goodie_bag', label: 'Goodie Bag', icon: ShoppingBag },
              ].map((item) => {
                const isIncluded = inclusions[item.key as keyof typeof inclusions];
                const Icon = item.icon;
                return (
                  <div key={item.key} className={`flex items-center p-3 rounded-xl border ${isIncluded ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-transparent opacity-50'}`}>
                    {isIncluded ? (
                      <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-slate-300 mr-3 shrink-0" />
                    )}
                    <span className={`flex items-center font-medium ${isIncluded ? 'text-slate-700' : 'text-slate-400'}`}>
                      <Icon className="h-4 w-4 mr-2" /> {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

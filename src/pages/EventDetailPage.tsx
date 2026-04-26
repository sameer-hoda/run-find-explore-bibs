import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Event, getAllEvents, slugify } from "@/services/eventService";
import EventDetails from "@/components/EventDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Event ID is missing");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const allEvents = await getAllEvents();
        const eventData = allEvents.find(e => slugify(e.event_name) === id);

        if (eventData) {
          setEvent(eventData);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const generateEventSchema = (event: Event) => {
    const description = event.event_description ? event.event_description.substring(0, 200) + '...' : `Join ${event.event_name} - a premier running event.`;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.event_name,
      "startDate": event.event_date,
      "description": description,
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "Place",
        "name": event.location.venue || event.location.city || 'India',
        "address": {
          "@type": "PostalAddress",
          "addressLocality": event.location.city,
          "addressRegion": event.location.state,
          "addressCountry": "IN"
        }
      },
      "image": [
        "https://mynextbib.com/running-man-favicon.svg"
      ],
      "organizer": {
        "@type": "Organization",
        "name": event.organizer_info.name || 'MyNextBib'
      }
    };
    return JSON.stringify(schema);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {event && (
        <Helmet>
          <title>{`${event.event_name} - ${event.location.city || 'India'} | ${event.event_date ? new Date(event.event_date).getFullYear() : ''} | mynextbib.com`}</title>
          <meta name="description" content={event.event_description ? event.event_description.substring(0, 160) : `Join ${event.event_name} in ${event.location.city || 'India'}. Distances: ${Object.keys(event.distances).filter(k => event.distances[k as keyof typeof event.distances] && k !== 'other').join(', ')}. Register now for this ${event.event_type} running event.`} />
          <meta name="keywords" content={`${event.event_name}, running event ${event.location.city || 'India'}, marathon ${event.location.city || ''}, ${Object.keys(event.distances).filter(k => event.distances[k as keyof typeof event.distances] && k !== 'other').join(', ')} run, race registration`} />

          <meta property="og:title" content={`${event.event_name} - ${event.location.city || 'India'} | mynextbib.com`} />
          <meta property="og:description" content={`Register for ${event.event_name}. A premier running event in ${event.location.city || 'India'} featuring ${Object.keys(event.distances).filter(k => event.distances[k as keyof typeof event.distances] && k !== 'other').join(', ')} distances.`} />
          <meta property="og:url" content={`https://mynextbib.com/event/${slugify(event.event_name)}`} />
          <meta property="og:type" content="event" />
          <meta property="og:image" content="https://mynextbib.com/mynextbib_logo.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://mynextbib.com/mynextbib_logo.png" />

          <link rel="canonical" href={`https://mynextbib.com/event/${slugify(event.event_name)}`} />

          <script type="application/ld+json">{generateEventSchema(event)}</script>
        </Helmet>
      )}
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-600 mb-2">{error}</h3>
              <p className="text-gray-500 mb-4">
                The event you're looking for might have been removed or is unavailable.
              </p>
              <Button onClick={handleGoBack}>
                Back to Events
              </Button>
            </div>
          ) : event ? (
            <EventDetails event={event} />
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetailPage;
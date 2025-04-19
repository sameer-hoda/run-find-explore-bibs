
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Event, getEventById } from "@/services/eventService";
import EventDetails from "@/components/EventDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

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
    
    // Simulating API fetch
    const fetchEvent = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          const eventData = getEventById(id);
          
          if (!eventData) {
            setError("Event not found");
          } else {
            setEvent(eventData);
          }
          
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event");
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
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

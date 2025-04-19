
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EventCard from "@/components/EventCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { useEventContext } from "@/context/EventContext";

const ResultsPage: React.FC = () => {
  const { filteredEvents, filterCriteria } = useEventContext();
  
  const getRecommendationText = () => {
    if (filteredEvents.length === 0) {
      return "No events match your criteria exactly, but here are some alternatives you might consider:";
    }
    
    if (filterCriteria.distances?.length === 1) {
      return `Great! We found ${filteredEvents.length} ${filterCriteria.distances[0]} events that match your preferences:`;
    }
    
    if (filterCriteria.eventType && filterCriteria.eventType !== "All") {
      return `We found ${filteredEvents.length} ${filterCriteria.eventType.toLowerCase()} events that match your criteria:`;
    }
    
    return `We found ${filteredEvents.length} events that match your preferences:`;
  };
  
  const getSuggestionText = () => {
    if (filteredEvents.length === 0) {
      return "Try broadening your criteria to see more events.";
    }
    
    if (filteredEvents.length < 3) {
      return "Want to see more options? Try adjusting your filter criteria.";
    }
    
    return "Looks like you have plenty of great options!";
  };
  
  const getCriteriaText = () => {
    const criteria = [];
    
    if (filterCriteria.eventType && filterCriteria.eventType !== "All") {
      criteria.push(`${filterCriteria.eventType} events`);
    }
    
    if (filterCriteria.distances && filterCriteria.distances.length > 0) {
      if (filterCriteria.distances.length === 1) {
        criteria.push(`${filterCriteria.distances[0]} distance`);
      } else {
        criteria.push(`Multiple distances (${filterCriteria.distances.join(", ")})`);
      }
    }
    
    if (filterCriteria.city) {
      criteria.push(`In ${filterCriteria.city}`);
    }
    
    if (filterCriteria.inclusions && filterCriteria.inclusions.length > 0) {
      const inclusionMap: Record<string, string> = {
        t_shirt: "T-shirt",
        medal: "Medal",
        timing_chip: "Timing chip",
        bib: "Bib",
        refreshments: "Refreshments",
        e_certificate: "E-certificate",
        goodie_bag: "Goodie bag"
      };
      
      const inclusionTexts = filterCriteria.inclusions.map(
        (inclusion) => inclusionMap[inclusion] || inclusion
      );
      
      criteria.push(`With ${inclusionTexts.join(", ")}`);
    }
    
    return criteria.length > 0 
      ? "You searched for: " + criteria.join(" • ") 
      : "Showing all events";
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader 
        title="Your Recommended Events" 
        subtitle="Based on your preferences, we've found these running events for you"
        showWizardButton={false}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Your Personalized Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{getRecommendationText()}</p>
            <p className="text-sm text-gray-500 mb-2">{getCriteriaText()}</p>
            <p className="text-sm text-gray-500 italic">{getSuggestionText()}</p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <Button asChild variant="outline">
                <Link to="/wizard">
                  Refine Search
                </Link>
              </Button>
              <Button asChild>
                <Link to="/">
                  Browse All Events <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="inline-flex justify-center items-center w-12 h-12 bg-orange-100 rounded-full mb-4">
              <Info className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No matching events found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find any events that match all your criteria. Try adjusting your preferences or browse all events.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline">
                <Link to="/wizard">
                  Try Again
                </Link>
              </Button>
              <Button asChild>
                <Link to="/">
                  Browse All Events
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsPage;

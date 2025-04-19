
import React from "react";
import RunFinderWizard from "@/components/RunFinderWizard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { FilterCriteria, Event } from "@/services/eventService";
import { useEventContext } from "@/context/EventContext";

const WizardPage: React.FC = () => {
  const { setFilteredEvents, setFilterCriteria } = useEventContext();
  
  const handleWizardComplete = (events: Event[], criteria: FilterCriteria) => {
    setFilteredEvents(events);
    setFilterCriteria(criteria);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader 
        title="Run Finder Wizard" 
        subtitle="Answer a few questions to discover your perfect running event"
        showWizardButton={false}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <RunFinderWizard onComplete={handleWizardComplete} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WizardPage;

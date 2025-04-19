import React from "react";
import { Link } from "react-router-dom";
import { Search, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  showWizardButton?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title = "Find Your Next Bib", 
  subtitle = "Discover running events tailored to your preferences", 
  showWizardButton = true 
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-center mb-4">
          <Footprints className="h-8 w-8 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold">mynextbib.com</h1>
        </div>
        
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-2">{title}</h2>
          <p className="text-blue-100 mb-6">{subtitle}</p>
          
          {showWizardButton && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Link to="/wizard">
                  <Footprints className="h-5 w-5 mr-2" /> 
                  New Runner Wizard
                </Link>
              </Button>
              
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-blue-500"
              >
                <Link to="/">
                  <Search className="h-5 w-5 mr-2" /> 
                  Browse All Events
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

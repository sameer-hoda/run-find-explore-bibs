import React from "react";
import { Link } from "react-router-dom";
import { Search, Footprints, HelpCircle } from "lucide-react"; // Import HelpCircle
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
    // Changed background gradient from blue to orange theme colors
    // Changed text color from white to primary-foreground for contrast
    // Reduced padding and removed the top logo/title section
    <div className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground">
      {/* Add H1 for SEO - visually hidden */}
      <h1 className="sr-only">{title}</h1>
      <div className="container mx-auto px-4 py-4 md:py-6"> 
        {/* Banner Section - Reduced height and margin */}
        <div className="relative w-full mx-auto h-48 md:h-64 rounded-lg shadow-lg overflow-hidden my-4 bg-cover bg-center" style={{ backgroundImage: `url('/banner.png')` }}>
          {/* Stack vertically on mobile, horizontally on medium+ */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col space-y-4 items-center justify-center md:flex-row md:space-y-0 md:space-x-4 p-4"> 
            {/* Find Your Next Run Button */}
            <Button
              asChild
              // size="lg" removed, using Tailwind classes for responsive sizing
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base font-semibold px-4 py-2 md:text-lg md:px-8 md:py-4" 
            >
              {/* Reverted to Link pointing to /wizard */}
              <Link to="/wizard"> 
                <Search className="h-5 w-5 mr-2" /> 
                Find Your Next Run
              </Link>
            </Button>
            {/* Running FAQ Button */}
            <Button
              asChild
              // size="lg" removed, using Tailwind classes for responsive sizing
              // Removed variant="outline"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base font-semibold px-4 py-2 md:text-lg md:px-8 md:py-4" // Use similar style as the other button
            >
              <Link to="/faq">
                <HelpCircle className="h-5 w-5 mr-2" /> 
                Running FAQ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

import React from "react";
import { Link } from "react-router-dom";
import { Menu, X, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  return (
    <div className="w-full bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Footprints className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-lg">mynextbib.com</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/wizard" className="text-gray-600 hover:text-primary transition-colors">
              Run Finder
            </Link>
            <Button asChild>
              <Link to="/">
                Find Events
              </Link>
            </Button>
          </div>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <SheetClose asChild>
                    <Link 
                      to="/"
                      className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                    >
                      Home
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/wizard"
                      className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                    >
                      Run Finder
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/"
                      className="flex items-center py-2 px-3 rounded-md bg-primary text-white hover:bg-primary/90"
                    >
                      Find Events
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

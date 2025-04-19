import React from "react";
import { Link } from "react-router-dom";
import { Footprints } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Footprints className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-lg">mynextbib.com</span>
            </div>
            <p className="text-gray-600 text-sm">
              Helping runners find their next perfect race since 2025.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/wizard" className="text-gray-600 hover:text-primary text-sm">
                  Run Finder Wizard
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary text-sm">
                  Browse Events
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary text-sm">
                  For Event Organizers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary text-sm">
                  Training Plans
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary text-sm">
                  Running Guides
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">
                Email: info@mynextbib.com
              </li>
              <li className="text-gray-600 text-sm">
                Phone: +91 1234567890
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} mynextbib.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

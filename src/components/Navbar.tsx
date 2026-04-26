import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-black/5 transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/mynextbib_logo.png" alt="mynextbib" className="h-8 w-auto" />
        </Link>

        <nav className="flex items-center space-x-4">
          <a
            href="https://www.strava.com/athletes/28362988"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-slate-500 hover:text-[#FC4C02] transition-colors"
          >
            by a runner, for runners
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

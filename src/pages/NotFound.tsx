import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <p className="text-2xl font-semibold text-gray-800">Page Not Found</p>
        <p className="text-gray-500 max-w-md">
          Oops! The page you were looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Return to Homepage
          </Link>
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
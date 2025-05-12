import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { User } from "@/types";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
        console.log("Attempting to log out...");
        await api.logout();
        console.log("Logout successful");
        localStorage.removeItem("token"); // Clear the token from local storage
        setUser(null); // Clear the user state
        toast.success("You have been logged out");
        navigate("/login"); // Redirect to the login page
    } catch (error) {
        console.error("Error during logout:", error);
        toast.error("Failed to log out");
    }
};

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-estate-500">Estate-Ease</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-estate-500 transition-colors">
              Home
            </Link>
            
            {!isLoading && !user && (
              <>
                <Link to="/login" className="px-3 py-2 text-gray-700 hover:text-estate-500 transition-colors">
                  Login
                </Link>
                <Link to="/signup">
                  <Button variant="default" className="bg-estate-500 hover:bg-estate-600">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            
            {!isLoading && user && (
              <>
                <Link to="/dashboard" className="px-3 py-2 text-gray-700 hover:text-estate-500 transition-colors">
                  Dashboard
                </Link>
                
                {user.role === "admin" && (
                  <Link to="/admin" className="px-3 py-2 text-gray-700 hover:text-estate-500 transition-colors">
                    Admin
                  </Link>
                )}
                
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-estate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-estate-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-estate-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          
          {!isLoading && !user && (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-estate-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-estate-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
          
          {!isLoading && user && (
            <>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-estate-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-estate-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-estate-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

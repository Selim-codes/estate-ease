import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoginForm } from "@/components/forms/LoginForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { api } from "@/lib/api";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await api.getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse space-y-6 w-full max-w-md p-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Image side */}
        <div 
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80")' }}
        >
          <div className="h-full w-full bg-black bg-opacity-20 flex items-end p-8">
            <h2 className="text-white text-2xl font-bold">Welcome back to your real estate journey</h2>
          </div>
        </div>
        
        {/* Form side */}
        <div className="w-full md:w-1/2 py-8 px-4 flex items-center">
          <div className="max-w-md mx-auto w-full">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-gray-600 mt-2">Log in to your Estate-Ease account</p>
              </div>
              
              <LoginForm />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-estate-600 hover:text-estate-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;

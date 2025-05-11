import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <div 
        className="flex-grow flex flex-col items-center justify-center bg-cover bg-center text-white py-32"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("http://d2qhoph587b7nd.cloudfront.net/river.jpeg")',
          minHeight: '80vh'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Find Your Dream Home in Birmingham
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Browse our curated selection of premium properties across Birmingham's most desirable neighborhoods.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login">
              <Button variant="default" size="lg" className="bg-estate-500 hover:bg-estate-600">
                Get Started
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-estate-500">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;

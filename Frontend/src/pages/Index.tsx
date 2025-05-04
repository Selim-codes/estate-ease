import { useState, useEffect } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyFilters } from "@/components/PropertyFilters";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { Property, PropertyFilter } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<PropertyFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const results = await api.getProperties(filters);
        setProperties(results);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [filters]);
  
  const handleFilterChange = (newFilters: PropertyFilter) => {
    setFilters(newFilters);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-estate-500 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Find Your Dream Home in Birmingham
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Browse our curated selection of premium properties across Birmingham's most desirable neighborhoods.
          </p>
        </div>
      </div>
      
      {/* Featured Properties Section */}
      <FeaturedProperties />
      
      {/* Main Content */}
      <div className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start">
            {/* Title and Filter Toggle for Mobile */}
            <div className="w-full md:w-auto flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">All Properties</h2>
              <Button
                variant="outline"
                className="md:hidden"
                onClick={toggleFilters}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters */}
            <div 
              className={`w-full md:w-72 flex-shrink-0 ${
                showFilters || window.innerWidth >= 768 ? "block" : "hidden"
              }`}
            >
              <PropertyFilters onFilter={handleFilterChange} />
            </div>
            
            {/* Property Grid */}
            <div className="flex-grow">
              {isLoading ? (
                <div className="property-grid">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 rounded-lg h-80 animate-pulse"
                    />
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters for more results.
                  </p>
                  <Button onClick={() => setFilters({})}>Clear Filters</Button>
                </div>
              ) : (
                <div className="property-grid">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Property, User } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatCurrency } from "@/lib/utils";
import { Bath, Bed, Home, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch property details
        if (id) {
          const propertyData = await api.getProperty(id);
          setProperty(propertyData);
        }
        
        // Check if user is logged in
        const userData = await api.getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleDeleteProperty = async () => {
    if (!property) return;
    
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        await api.deleteProperty(property.id);
        toast.success("Property deleted successfully");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error deleting property:", error);
        toast.error((error as Error).message || "Failed to delete property");
      }
    }
  };
  
  const handleEditProperty = () => {
    navigate(`/dashboard/edit-property/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse space-y-8 w-full max-w-4xl p-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <p className="mb-8">The property you are looking for does not exist or has been removed.</p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const statusColors = {
    available: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    sold: "bg-red-100 text-red-800",
  };

  const canEdit = currentUser && (
    currentUser.id === property.agentId || 
    currentUser.role === "admin"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-1" />
                <span>{property.address}, {property.city}, {property.zipCode}</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <Badge variant="secondary" className={statusColors[property.status]}>
                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {/* Main Image */}
              <div className="relative rounded-lg overflow-hidden shadow">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '500px' }}
                />
                {property.featured && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Property Features */}
              <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-sm">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Bed size={24} className="text-estate-500" />
                  </div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-bold text-xl">{property.bedrooms}</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Bath size={24} className="text-estate-500" />
                  </div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="font-bold text-xl">{property.bathrooms}</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Home size={24} className="text-estate-500" />
                  </div>
                  <p className="text-sm text-gray-600">Square Feet</p>
                  <p className="font-bold text-xl">{property.squareFeet}</p>
                </div>
              </div>
              
              {/* Property Description */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              </div>
              
              {/* Edit/Delete Options for Agents/Admins */}
              {canEdit && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-3">Management Options</h2>
                  <div className="flex gap-3">
                    <Button onClick={handleEditProperty}>
                      Edit Property
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteProperty}
                    >
                      Delete Property
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              {/* Price Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6 sticky top-4">
                <h2 className="text-2xl font-bold text-estate-700 mb-4">
                  {formatCurrency(property.price)}
                </h2>
                
                <div className="mt-3 text-sm text-gray-600">
                  <p className="flex items-center">
                    <span className="font-semibold mr-1">Type:</span>
                    <span className="capitalize">{property.propertyType}</span>
                  </p>
                </div>
                
                {/* Agent Information */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-2">Listed by:</h3>
                  <p className="text-gray-700">{property.agentName}</p>
                </div>
                
                <Button className="w-full mt-6">
                  Contact Agent
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertyDetails;

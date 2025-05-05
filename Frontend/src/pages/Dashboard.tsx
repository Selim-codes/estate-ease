import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Property, User } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { PropertyTable } from "@/components/dashboard/PropertyTable";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("properties");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await api.getCurrentUser();
        if (!user) {
          navigate("/login");
          return;
        }
        
        setCurrentUser(user);
        fetchProperties();
      } catch (error) {
        console.error("Error checking auth status:", error);
        navigate("/login");
      }
    };
    
    const fetchProperties = async () => {
      try {
        const propertiesData = await api.getMyProperties();
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load your properties");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [navigate]);
  
  const refetchProperties = async () => {
    try {
      setIsLoading(true);
      const propertiesData = await api.getMyProperties();
      setProperties(propertiesData);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to reload your properties");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse space-y-8 w-full max-w-4xl p-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {currentUser.name}
            </p>
          </div>
          
          <Tabs defaultValue="properties" value={activeTab} onValueChange={handleTabChange}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="properties">My Properties</TabsTrigger>
                <TabsTrigger value="addProperty">Add New Property</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="properties" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <PropertyTable 
                  properties={properties} 
                  refetch={refetchProperties}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="addProperty">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Add New Property</h2>
                <PropertyForm onSave={() => {
                  refetchProperties();
                  setActiveTab("properties");
                }} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

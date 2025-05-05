import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Property, User } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyTable } from "@/components/dashboard/PropertyTable";
import { UserTable } from "@/components/admin/UserTable";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const Admin = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await api.getCurrentUser();
        if (!user) {
          navigate("/login");
          return;
        }
        
        if (user.role !== "admin") {
          toast.error("Unauthorized: Admin access only");
          navigate("/dashboard");
          return;
        }
        
        setCurrentUser(user);
        
        // Fetch users and properties
        fetchData();
      } catch (error) {
        console.error("Error checking auth status:", error);
        navigate("/login");
      }
    };
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [usersData, propertiesData] = await Promise.all([
          api.getUsers(),
          api.getProperties(),
        ]);
        
        setUsers(usersData);
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load admin data");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [navigate]);
  
  const refetchUsers = async () => {
    try {
      const usersData = await api.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to reload user data");
    }
  };
  
  const refetchProperties = async () => {
    try {
      const propertiesData = await api.getProperties();
      setProperties(propertiesData);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to reload property data");
    }
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

  if (!currentUser || currentUser.role !== "admin") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage users and properties
            </p>
          </div>
          
          <Tabs defaultValue="users">
            <TabsList className="mb-6">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="properties">All Properties</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Manage Users</h2>
                <UserTable 
                  users={users} 
                  refetch={refetchUsers}
                  currentUserId={currentUser.id}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="properties" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Manage Properties</h2>
                <PropertyTable 
                  properties={properties}
                  refetch={refetchProperties}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;

import {
  LoginCredentials,
  Property,
  PropertyFilter,
  PropertyFormData,
  SignupData,
  User,
} from "@/types";
import { toast } from "sonner";

// Mock data
const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Modern Villa in Edgbaston",
    description:
      "Beautiful modern villa with garden and pool in the heart of Edgbaston.",
    address: "123 Edgbaston Park Road",
    city: "Birmingham",
    zipCode: "B15 2TT",
    price: 750000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2500,
    propertyType: "house",
    status: "available",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    featured: true,
    agentId: "1",
    agentName: "Sarah Johnson",
    createdAt: new Date(2023, 10, 15).toISOString(),
  },
  {
    id: "2",
    title: "Luxury Apartment in Jewellery Quarter",
    description:
      "Stunning luxury apartment with panoramic city views in Birmingham's trendy Jewellery Quarter.",
    address: "45 St Paul's Square",
    city: "Birmingham",
    zipCode: "B3 1FQ",
    price: 425000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    propertyType: "apartment",
    status: "available",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    featured: true,
    agentId: "2",
    agentName: "David Thompson",
    createdAt: new Date(2023, 11, 5).toISOString(),
  },
  {
    id: "3",
    title: "Cozy Townhouse in Moseley",
    description:
      "Charming townhouse with private garden in vibrant Moseley village.",
    address: "89 Alcester Road",
    city: "Birmingham",
    zipCode: "B13 8EA",
    price: 350000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    propertyType: "townhouse",
    status: "available",
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    featured: false,
    agentId: "1",
    agentName: "Sarah Johnson",
    createdAt: new Date(2023, 11, 20).toISOString(),
  },
  {
    id: "4",
    title: "Penthouse in City Centre",
    description:
      "Exclusive penthouse with wrap-around terrace and stunning views across Birmingham city centre.",
    address: "1 Chamberlain Square",
    city: "Birmingham",
    zipCode: "B3 3HN",
    price: 950000,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2200,
    propertyType: "apartment",
    status: "pending",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    featured: true,
    agentId: "3",
    agentName: "Michael Chen",
    createdAt: new Date(2023, 9, 10).toISOString(),
  },
  {
    id: "5",
    title: "Victorian House in Harborne",
    description:
      "Beautifully renovated Victorian house with period features in leafy Harborne.",
    address: "56 High Street",
    city: "Birmingham",
    zipCode: "B17 9NP",
    price: 675000,
    bedrooms: 5,
    bathrooms: 3,
    squareFeet: 2800,
    propertyType: "house",
    status: "available",
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    featured: false,
    agentId: "2",
    agentName: "David Thompson",
    createdAt: new Date(2023, 10, 5).toISOString(),
  },
  {
    id: "6",
    title: "Studio Flat near University",
    description:
      "Modern studio apartment ideal for students or young professionals close to the University of Birmingham.",
    address: "23 Bristol Road",
    city: "Birmingham",
    zipCode: "B29 6LG",
    price: 150000,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 450,
    propertyType: "apartment",
    status: "available",
    imageUrl:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    featured: false,
    agentId: "1",
    agentName: "Sarah Johnson",
    createdAt: new Date(2023, 11, 28).toISOString(),
  },
  {
    id: "7",
    title: "Canal-side Condo",
    description:
      "Contemporary condo with private balcony overlooking Birmingham's historic canal network.",
    address: "12 Gas Street Basin",
    city: "Birmingham",
    zipCode: "B1 2JT",
    price: 375000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1000,
    propertyType: "condo",
    status: "available",
    imageUrl:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    featured: true,
    agentId: "3",
    agentName: "Michael Chen",
    createdAt: new Date(2023, 10, 25).toISOString(),
  },
  {
    id: "8",
    title: "Modern Terraced House in Bournville",
    description:
      "Stylish terraced house in the charming Bournville village with private garden.",
    address: "78 Mary Vale Road",
    city: "Birmingham",
    zipCode: "B30 2DQ",
    price: 290000,
    bedrooms: 3,
    bathrooms: 1,
    squareFeet: 1100,
    propertyType: "house",
    status: "sold",
    imageUrl:
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    featured: false,
    agentId: "2",
    agentName: "David Thompson",
    createdAt: new Date(2023, 8, 15).toISOString(),
  },
];

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "agent",
    createdAt: new Date(2023, 5, 10).toISOString(),
  },
  {
    id: "2",
    name: "David Thompson",
    email: "david.thompson@example.com",
    role: "agent",
    createdAt: new Date(2023, 6, 15).toISOString(),
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "agent",
    createdAt: new Date(2023, 7, 20).toISOString(),
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    createdAt: new Date(2023, 1, 1).toISOString(),
  },
];

// Simulate localStorage for auth
let currentUser: User | null = null;
const storedUser = localStorage.getItem("estate-ease-user");
if (storedUser) {
  try {
    currentUser = JSON.parse(storedUser);
  } catch (e) {
    localStorage.removeItem("estate-ease-user");
  }
}

// Delay function to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API functions
export const api = {
  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<User> {
    await delay(800);

    // For demo, just check if email exists and return the user
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Store user in localStorage
    localStorage.setItem("estate-ease-user", JSON.stringify(user));
    currentUser = user;

    return user;
  },

  async signup(data: SignupData): Promise<User> {
    await delay(1000);

    // Check if email is already in use
    if (
      MOCK_USERS.some((u) => u.email.toLowerCase() === data.email.toLowerCase())
    ) {
      throw new Error("Email already in use");
    }

    // Create new user - default to agent role
    const newUser: User = {
      id: `${MOCK_USERS.length + 1}`,
      name: data.name,
      email: data.email,
      role: "agent",
      createdAt: new Date().toISOString(),
    };

    MOCK_USERS.push(newUser);

    // Store user in localStorage
    localStorage.setItem("estate-ease-user", JSON.stringify(newUser));
    currentUser = newUser;

    return newUser;
  },

  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem("estate-ease-user");
    currentUser = null;
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(300);
    return currentUser;
  },

  // Properties endpoints
  async getProperties(filters?: PropertyFilter): Promise<Property[]> {
    await delay(800);

    let filteredProperties = [...MOCK_PROPERTIES];

    if (filters) {
      if (filters.propertyType) {
        filteredProperties = filteredProperties.filter(
          (p) => p.propertyType === filters.propertyType
        );
      }

      if (filters.minPrice) {
        filteredProperties = filteredProperties.filter(
          (p) => p.price >= filters.minPrice!
        );
      }

      if (filters.maxPrice) {
        filteredProperties = filteredProperties.filter(
          (p) => p.price <= filters.maxPrice!
        );
      }

      if (filters.minBedrooms) {
        filteredProperties = filteredProperties.filter(
          (p) => p.bedrooms >= filters.minBedrooms!
        );
      }

      if (filters.minBathrooms) {
        filteredProperties = filteredProperties.filter(
          (p) => p.bathrooms >= filters.minBathrooms!
        );
      }

      if (filters.agent) {
        filteredProperties = filteredProperties.filter(
          (p) => p.agentId === filters.agent
        );
      }
    }

    return filteredProperties;
  },

  async getProperty(id: string): Promise<Property> {
    await delay(500);

    const property = MOCK_PROPERTIES.find((p) => p.id === id);

    if (!property) {
      throw new Error("Property not found");
    }

    return property;
  },

  async getMyProperties(): Promise<Property[]> {
    await delay(800);

    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    return MOCK_PROPERTIES.filter((p) => p.agentId === currentUser!.id);
  },

  async createProperty(data: PropertyFormData): Promise<Property> {
    await delay(1000);

    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    if (currentUser.role !== "agent" && currentUser.role !== "admin") {
      throw new Error("Only agents can create property listings");
    }

    const newProperty: Property = {
      id: `${MOCK_PROPERTIES.length + 1}`,
      ...data,
      agentId: currentUser.id,
      agentName: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    MOCK_PROPERTIES.push(newProperty);

    return newProperty;
  },

  async updateProperty(
    id: string,
    data: Partial<PropertyFormData>
  ): Promise<Property> {
    await delay(1000);

    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    const propertyIndex = MOCK_PROPERTIES.findIndex((p) => p.id === id);

    if (propertyIndex === -1) {
      throw new Error("Property not found");
    }

    const property = MOCK_PROPERTIES[propertyIndex];

    if (property.agentId !== currentUser.id && currentUser.role !== "admin") {
      throw new Error("You can only update your own listings");
    }

    const updatedProperty = {
      ...property,
      ...data,
    };

    MOCK_PROPERTIES[propertyIndex] = updatedProperty;

    return updatedProperty;
  },

  async deleteProperty(id: string): Promise<void> {
    await delay(800);

    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    const propertyIndex = MOCK_PROPERTIES.findIndex((p) => p.id === id);

    if (propertyIndex === -1) {
      throw new Error("Property not found");
    }

    const property = MOCK_PROPERTIES[propertyIndex];

    if (property.agentId !== currentUser.id && currentUser.role !== "admin") {
      throw new Error("You can only delete your own listings");
    }

    MOCK_PROPERTIES.splice(propertyIndex, 1);
  },

  // Admin endpoints
  async getUsers(): Promise<User[]> {
    await delay(800);

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return MOCK_USERS;
  },

  async updateUserRole(userId: string, role: "agent" | "admin"): Promise<User> {
    await delay(800);

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const userIndex = MOCK_USERS.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...MOCK_USERS[userIndex],
      role,
    };

    MOCK_USERS[userIndex] = updatedUser;

    return updatedUser;
  },

  async deleteUser(userId: string): Promise<void> {
    await delay(800);

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const userIndex = MOCK_USERS.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    MOCK_USERS.splice(userIndex, 1);
  },
};

// React Query util functions
export const queryClient = {
  invalidateQueries: (key: string) => {
    console.log(`Invalidating queries with key: ${key}`);
    toast.success("Data updated successfully");
  },
};

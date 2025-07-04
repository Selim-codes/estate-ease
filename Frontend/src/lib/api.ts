import {
  LoginCredentials,
  Property,
  PropertyFilter,
  PropertyFormData,
  SignupData,
  User,
} from "@/types";
import { toast } from "sonner";

const API_BASE_URL = "http://group55elb-590010270.us-east-1.elb.amazonaws.com"; // Backend base URL
console.log(API_BASE_URL)

// Utility function to handle API requests
const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "", // Include the token
      ...options.headers,
    },
    credentials: "include", // Include cookies for authentication
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

// API functions
export const api = {
  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await request<{ token: string; user: User }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );

    // Store the token in localStorage or cookies
    localStorage.setItem("token", response.token);

    return response.user;
  },

  async signup(data: SignupData): Promise<User> {
    return request<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<void> {
    return request<void>("/api/auth/logout", {
      method: "POST",
    });
  },

  async getCurrentUser(): Promise<User | null> {
    return request<User | null>("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
      },
    });
  },
  //jwt to get the token and user details

  // Properties endpoints
  async getProperties(filters?: PropertyFilter): Promise<Property[]> {
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.propertyType)
        queryParams.append("propertyType", filters.propertyType);
      if (filters.minPrice)
        queryParams.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice)
        queryParams.append("maxPrice", filters.maxPrice.toString());
      if (filters.minBedrooms)
        queryParams.append("minBedrooms", filters.minBedrooms.toString());
      if (filters.minBathrooms)
        queryParams.append("minBathrooms", filters.minBathrooms.toString());
      if (filters.agent) queryParams.append("agent", filters.agent);
    }

    return request<Property[]>(`/api/properties?${queryParams.toString()}`);
  },

  async getProperty(id: string): Promise<Property> {
    return request<Property>(`/api/properties/${id}`);
  },

  async getMyProperties(): Promise<Property[]> {
    return request<Property[]>("/api/properties/my");
  },

  async createProperty(data: PropertyFormData): Promise<Property> {
    return request<Property>("/api/properties", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json", // Ensure the content type is JSON
      },
    });
  },

  async updateProperty(
    id: string,
    data: Partial<PropertyFormData>
  ): Promise<Property> {
    return request<Property>(`/api/properties/update-properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteProperty(id: string): Promise<void> {
    return request<void>(`/api/properties/delete-properties/${id}`, {
      method: "DELETE",
    });
  },

  // Admin endpoints
  async getUsers(): Promise<User[]> {
    return request<User[]>("/users");
  },

  async updateUserRole(userId: string, role: "agent" | "admin"): Promise<User> {
    return request<User>(`/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  },

  async deleteUser(userId: string): Promise<void> {
    return request<void>(`/users/${userId}`, {
      method: "DELETE",
    });
  },
};

// React Query util functions
export const queryClient = {
  invalidateQueries: (key: string) => {
    console.log(`Invalidating queries with key: ${key}`);
    toast.success("Data updated successfully");
  },
};

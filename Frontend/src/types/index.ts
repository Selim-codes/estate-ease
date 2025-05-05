export type UserRole = "agent" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type PropertyType =
  | "house"
  | "apartment"
  | "condo"
  | "townhouse"
  | "land";
export type PropertyStatus = "available" | "pending" | "sold";

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: PropertyType;
  status: PropertyStatus;
  imageUrl: string;
  featured: boolean;
  agentId: string;
  agentName: string;
  createdAt: string;
}

export interface PropertyFilter {
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  agent?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  address: string;
  city: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: PropertyType;
  status: PropertyStatus;
  imageUrl: string;
  featured: boolean;
}

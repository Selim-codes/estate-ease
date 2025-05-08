import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { api, queryClient } from "@/lib/api";
import { Property, PropertyFormData, PropertyStatus, PropertyType } from "@/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PropertyFormProps {
  property?: Property;
  onSave?: () => void;
}

export const PropertyForm = ({ property, onSave }: PropertyFormProps) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    address: "",
    city: "Birmingham",
    zipCode: "",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 0,
    propertyType: "house",
    status: "available",
    imageUrl: "",
    featured: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Initialize form with existing property data if editing
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        address: property.address,
        city: property.city,
        zipCode: property.zipCode,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.squareFeet,
        propertyType: property.propertyType,
        status: property.status,
        imageUrl: property.imageUrl,
        featured: property.featured,
      });
    }
  }, [property]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "Zip/Postal code is required";
      isValid = false;
    }
    
    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
      isValid = false;
    }
    
    if (formData.bedrooms < 0) {
      newErrors.bedrooms = "Bedrooms cannot be negative";
      isValid = false;
    }
    
    if (formData.bathrooms < 0) {
      newErrors.bathrooms = "Bathrooms cannot be negative";
      isValid = false;
    }
    
    if (formData.squareFeet <= 0) {
      newErrors.squareFeet = "Square feet must be greater than 0";
      isValid = false;
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;
    
    // Parse number inputs
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
    
    // Clear the error for this field when the user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (property) {
        await api.updateProperty(property.id, formData);
        toast.success("Property updated successfully");
        queryClient.invalidateQueries('properties');
      } else {
        await api.createProperty(formData);
        toast.success("Property created successfully");
        queryClient.invalidateQueries('properties');
      }
      
      if (onSave) {
        onSave();
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Property form error:", error);
      toast.error((error as Error).message || "Failed to save property");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sample image URLs for demo
  const sampleImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Property Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Beautiful 3-bedroom house in Edgbaston"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the property..."
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled  // Birmingham only for this demo
              />
            </div>
            
            <div>
              <Label htmlFor="zipCode">Postal Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="e.g. B1 1AA"
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (£)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              min="0"
              placeholder="Property price"
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
          </div>
          
          <div>
            <Label htmlFor="squareFeet">Square Feet</Label>
            <Input
              id="squareFeet"
              name="squareFeet"
              type="number"
              value={formData.squareFeet}
              onChange={handleChange}
              min="0"
              placeholder="Property area"
              className={errors.squareFeet ? "border-red-500" : ""}
            />
            {errors.squareFeet && <p className="text-sm text-red-500 mt-1">{errors.squareFeet}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
              min="0"
              className={errors.bedrooms ? "border-red-500" : ""}
            />
            {errors.bedrooms && <p className="text-sm text-red-500 mt-1">{errors.bedrooms}</p>}
          </div>
          
          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange}
              min="0"
              className={errors.bathrooms ? "border-red-500" : ""}
            />
            {errors.bathrooms && <p className="text-sm text-red-500 mt-1">{errors.bathrooms}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  propertyType: value as PropertyType,
                }));
              }}
            >
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  status: value as PropertyStatus,
                }));
              }}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="imageUrl">Property Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="URL to property image"
            className={errors.imageUrl ? "border-red-500" : ""}
          />
          {errors.imageUrl && <p className="text-sm text-red-500 mt-1">{errors.imageUrl}</p>}
          
          <div className="mt-2">
            <Label className="text-sm text-gray-600">Sample images (click to use):</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {sampleImages.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Sample ${index + 1}`}
                  className="h-12 w-full object-cover rounded cursor-pointer border hover:border-estate-500 transition-colors"
                  onClick={() => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => {
              setFormData((prev) => ({
                ...prev,
                featured: !!checked,
              }));
            }}
          />
          <Label htmlFor="featured" className="cursor-pointer">
            Mark as featured property
          </Label>
        </div>
      </div>
      
      <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
        {isLoading
          ? property
            ? "Updating Property..."
            : "Creating Property..."
          : property
          ? "Update Property"
          : "Create Property"}
      </Button>
    </form>
  );
};

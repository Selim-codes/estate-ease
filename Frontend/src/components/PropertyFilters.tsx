import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PropertyFilter, PropertyType } from "@/types";

interface PropertyFiltersProps {
  onFilter: (filters: PropertyFilter) => void;
  className?: string;
}

export const PropertyFilters = ({ onFilter, className }: PropertyFiltersProps) => {
  const [propertyType, setPropertyType] = useState<PropertyType | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [bedrooms, setBedrooms] = useState<number | undefined>(undefined);
  const [bathrooms, setBathrooms] = useState<number | undefined>(undefined);
  
  const handleFilter = () => {
    onFilter({
      propertyType,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minBedrooms: bedrooms,
      minBathrooms: bathrooms,
    });
  };
  
  const handleReset = () => {
    setPropertyType(undefined);
    setPriceRange([0, 1000000]);
    setBedrooms(undefined);
    setBathrooms(undefined);
    
    onFilter({});
  };
  
  const formatPrice = (value: number) => {
    return `£${value.toLocaleString()}`;
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border ${className}`}>
      <h2 className="text-lg font-semibold mb-4">Filter Properties</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="propertyType">Property Type</Label>
          <Select 
            value={propertyType} 
            onValueChange={(value) => setPropertyType(value as PropertyType)}
          >
            <SelectTrigger id="propertyType">
              <SelectValue placeholder="All property types" />
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
        
        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="pt-6 px-2">
            <Slider
              defaultValue={[0, 1000000]}
              max={1000000}
              step={10000}
              value={priceRange}
              onValueChange={setPriceRange as (value: number[]) => void}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Min Bedrooms</Label>
            <Select 
              value={bedrooms?.toString() || ""} 
              onValueChange={(value) => setBedrooms(value ? Number(value) : undefined)}
            >
              <SelectTrigger id="bedrooms">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Min Bathrooms</Label>
            <Select 
              value={bathrooms?.toString() || ""} 
              onValueChange={(value) => setBathrooms(value ? Number(value) : undefined)}
            >
              <SelectTrigger id="bathrooms">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="pt-4 flex gap-3">
          <Button className="w-full" onClick={handleFilter}>Apply Filters</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>
      </div>
    </div>
  );
};

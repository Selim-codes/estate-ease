import { Property } from "@/types";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Bath, Bed, Home, MapPin } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const statusColors = {
    available: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    sold: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-property overflow-hidden transition-all-200 hover:shadow-lg">
      <div className="relative">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="property-image"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className={statusColors[property.status]}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
          {property.featured && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Featured
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{property.title}</h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{property.address}, {property.city}</span>
        </div>
        
        <div className="flex gap-4 mb-3">
          <div className="flex items-center text-gray-700">
            <Bed size={18} className="mr-1" />
            <span>{property.bedrooms}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Bath size={18} className="mr-1" />
            <span>{property.bathrooms}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Home size={18} className="mr-1" />
            <span>{property.squareFeet} ft²</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="font-bold text-lg text-estate-700">
            {formatCurrency(property.price)}
          </div>
          
          <Link
            to={`/properties/${property.id}`}
            className="text-estate-600 hover:text-estate-700 font-medium text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { Property } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, queryClient } from "@/lib/api";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PropertyForm } from "../forms/PropertyForm";

interface PropertyTableProps {
  properties: Property[];
  refetch: () => void;
}

export const PropertyTable = ({ properties, refetch }: PropertyTableProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  
  const handleDelete = async () => {
    if (!propertyToDelete) return;
    
    try {
      await api.deleteProperty(propertyToDelete.id);
      toast.success("Property deleted successfully");
      queryClient.invalidateQueries("properties");
      refetch();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error((error as Error).message || "Failed to delete property");
    } finally {
      setIsDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };
  
  const confirmDelete = (property: Property) => {
    setPropertyToDelete(property);
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = (property: Property) => {
    setPropertyToEdit(property);
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Available</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case "sold":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Sold</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Property</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rooms</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No properties found.
              </TableCell>
            </TableRow>
          ) : (
            properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div className="truncate max-w-[180px]">
                      <span className="font-medium">{property.title}</span>
                      <div className="text-xs text-gray-500 truncate">
                        {property.address}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(property.price)}</TableCell>
                <TableCell className="capitalize">{property.propertyType}</TableCell>
                <TableCell>{getStatusBadge(property.status)}</TableCell>
                <TableCell>{property.bedrooms} bed, {property.bathrooms} bath</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(property)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => confirmDelete(property)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this property?</p>
            <p className="font-medium">{propertyToDelete?.title}</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Property Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          {propertyToEdit && (
            <PropertyForm
              property={propertyToEdit}
              onSave={() => {
                setIsEditDialogOpen(false);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

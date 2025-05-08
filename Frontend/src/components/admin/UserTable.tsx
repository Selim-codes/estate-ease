import { useState } from "react";
import { User, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, queryClient } from "@/lib/api";
import { toast } from "sonner";

interface UserTableProps {
  users: User[];
  refetch: () => void;
  currentUserId: string;
}

export const UserTable = ({ users, refetch, currentUserId }: UserTableProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("agent");
  
  const handleDelete = async () => {
    if (!userToDelete) return;
    
    if (userToDelete.id === currentUserId) {
      toast.error("You cannot delete your own account");
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      return;
    }
    
    try {
      await api.deleteUser(userToDelete.id);
      toast.success("User deleted successfully");
      queryClient.invalidateQueries("users");
      refetch();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error((error as Error).message || "Failed to delete user");
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };
  
  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleEditRole = (user: User) => {
    setUserToEdit(user);
    setSelectedRole(user.role);
    setIsEditRoleDialogOpen(true);
  };

  const updateUserRole = async () => {
    if (!userToEdit) return;
    
    if (userToEdit.id === currentUserId && selectedRole !== "admin") {
      toast.error("You cannot remove your own admin privileges");
      setIsEditRoleDialogOpen(false);
      setUserToEdit(null);
      return;
    }
    
    try {
      await api.updateUserRole(userToEdit.id, selectedRole);
      toast.success(`User role updated to ${selectedRole}`);
      queryClient.invalidateQueries("users");
      refetch();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error((error as Error).message || "Failed to update user role");
    } finally {
      setIsEditRoleDialogOpen(false);
      setUserToEdit(null);
    }
  };
  
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Badge variant="outline" className="bg-violet-100 text-violet-800 hover:bg-violet-100">Admin</Badge>;
      case "agent":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Agent</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.name}
                {user.id === currentUserId && (
                  <span className="ml-2 text-xs text-gray-500">(You)</span>
                )}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditRole(user)}>
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => confirmDelete(user)}
                      disabled={user.id === currentUserId}
                    >
                      {user.id === currentUserId ? "Cannot delete yourself" : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this user?</p>
            <p className="font-medium">{userToDelete?.name}</p>
            <p className="text-sm text-gray-500">{userToDelete?.email}</p>
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
      
      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Change role for <span className="font-medium">{userToEdit?.name}</span>
            </p>
            
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateUserRole}>
                Update Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { roleService } from '@/api/roles/role.service';
import type { Role } from '@/api/roles/role.types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ManageUserRolesDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: {
        _id: string;
        name: string;
        username: string;
        roles?: string[];
    };
}

export function ManageUserRolesDialog({ open, onClose, onSuccess, user }: ManageUserRolesDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles || []);

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        setSelectedRoles(user.roles || []);
    }, [user]);

    const fetchRoles = async () => {
        try {
            const response = await roleService.listRoles();
            if (response.success) {
                setRoles(response.roles);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch roles',
                variant: 'destructive',
            });
        }
    };

    const handleRoleToggle = (roleId: string) => {
        setSelectedRoles(prev => {
            if (prev.includes(roleId)) {
                return prev.filter(id => id !== roleId);
            } else {
                return [...prev, roleId];
            }
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Remove roles that are no longer selected
            const rolesToRemove = (user.roles || []).filter(
                roleId => !selectedRoles.includes(roleId)
            );

            // Add newly selected roles
            const rolesToAdd = selectedRoles.filter(
                roleId => !(user.roles || []).includes(roleId)
            );

            // Process removals
            for (const roleId of rolesToRemove) {
                await roleService.removeUserFromRole({
                    roleId,
                    username: user.username
                });
            }

            // Process additions
            for (const roleId of rolesToAdd) {
                await roleService.addUserToRole({
                    roleId,
                    username: user.username
                });
            }

            toast({
                title: 'Success',
                description: 'User roles updated successfully',
            });
            onSuccess();
            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update user roles',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manage Roles - {user.name}</DialogTitle>
                </DialogHeader>
                
                <div className="py-4">
                    <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-4">
                            {roles.map((role) => (
                                <div key={role._id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={role._id}
                                        checked={selectedRoles.includes(role._id)}
                                        onCheckedChange={() => handleRoleToggle(role._id)}
                                        disabled={loading || role.protected}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label
                                            htmlFor={role._id}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {role.name}
                                        </Label>
                                        {role.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {role.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
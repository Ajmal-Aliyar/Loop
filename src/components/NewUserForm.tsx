import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/api/users/user.service';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { roleService } from '@/api/roles/role.service';
import type { Role } from '@/api/roles/role.types';

interface NewUserFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    className?: string;
    editUser?: {
        _id: string;
        email: string;
        name: string;
        username: string;
        roles?: string[];
        active?: boolean;
    };
}

export function NewUserForm({ isOpen, onClose, onSuccess, className, editUser }: NewUserFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        isEmailVerified: false,
        requirePasswordChange: true,
        joinDefaultChannels: true,
    });

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Fetch roles when component mounts
    useEffect(() => {
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

        fetchRoles();
    }, []);

    // Update form data when editUser changes
    useEffect(() => {
        if (editUser) {
            setFormData(prev => ({
                ...prev,
                email: editUser.email,
                name: editUser.name,
                username: editUser.username,
                role: editUser.roles?.[0] || 'user',
                // Don't set password fields when editing
                password: '',
                confirmPassword: '',
            }));
        } else {
            // Reset form when not editing
            setFormData({
                email: '',
                name: '',
                username: '',
                password: '',
                confirmPassword: '',
                role: 'user',
                isEmailVerified: false,
                requirePasswordChange: true,
                joinDefaultChannels: true,
            });
        }
    }, [editUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser && formData.password !== formData.confirmPassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match',
                variant: 'destructive',
            });
            return;
        }

        try {
            setLoading(true);
            let response;

            if (editUser) {
                // Update existing user
                const updateData: any = {
                    name: formData.name,
                    username: formData.username,
                    roles: [formData.role],
                };

                // Only include password if it's been changed
                if (formData.password) {
                    updateData.password = formData.password;
                }

                response = await userService.updateUser({
                    userId: editUser._id,
                    data: updateData
                });
            } else {
                // Create new user
                response = await userService.createUser({
                    email: formData.email,
                    name: formData.name,
                    username: formData.username,
                    password: formData.password,
                    roles: [formData.role],
                    active: true,
                });
            }

            if (response.success) {
                toast({
                    title: 'Success',
                    description: editUser ? 'User updated successfully' : 'User created successfully',
                });
                onSuccess();
                onClose();
                // Reset form
                setFormData({
                    email: '',
                    name: '',
                    username: '',
                    password: '',
                    confirmPassword: '',
                    role: 'user',
                    isEmailVerified: false,
                    requirePasswordChange: true,
                    joinDefaultChannels: true,
                });
            }


            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'User created successfully',
                });
                onSuccess();
                onClose();
                // Reset form
                setFormData({
                    email: '',
                    name: '',
                    username: '',
                    password: '',
                    confirmPassword: '',
                    role: 'user',
                    isEmailVerified: false,
                    requirePasswordChange: true,
                    joinDefaultChannels: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data.error.split(':')[0] || 'Failed to create user',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const formContent = (
        <form onSubmit={handleSubmit} className="space-y-6 py-10 overflow-y-auto max-h-screen">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{editUser ? 'Edit User' : 'New User'}</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={onClose}
                    className=""
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                        disabled={!!editUser}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role._id} value={role._id}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {!editUser && (
                    <><div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        required
                    />
                </div></>)}

                <div className="flex items-center justify-between">
                    <Label htmlFor="isEmailVerified">Mark email as verified</Label>
                    <Switch
                        id="isEmailVerified"
                        checked={formData.isEmailVerified}
                        onCheckedChange={(checked) => handleChange('isEmailVerified', checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label htmlFor="requirePasswordChange">Require password change</Label>
                    <Switch
                        id="requirePasswordChange"
                        checked={formData.requirePasswordChange}
                        onCheckedChange={(checked) => handleChange('requirePasswordChange', checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label htmlFor="joinDefaultChannels">Join default channels</Label>
                    <Switch
                        id="joinDefaultChannels"
                        checked={formData.joinDefaultChannels}
                        onCheckedChange={(checked) => handleChange('joinDefaultChannels', checked)}
                    />
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
            </Button>
        </form>
    );

    // For small screens, render in a dialog
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px]">
                    {formContent}
                </DialogContent>
            </Dialog>
        );
    }

    // For large screens, render in a side panel
    return (
        <div className={`hidden ${isOpen ? 'lg:block' : ''}  border-l border-border ${className}`}>
            <div className="p-6 w-[400px]">
                {formContent}
            </div>
        </div>
    );
}
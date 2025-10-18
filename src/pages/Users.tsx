import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewUserForm } from '@/components/NewUserForm';
import { ManageUserRolesDialog } from '@/components/ManageUserRolesDialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { Mail, Menu, MoreVertical, Search, UserPlus } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { useChatStore } from '@/store/chatStore';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/api/users/user.service';
import { roleService } from '@/api/roles/role.service';
import type { User } from '@/api/users/user.types';
import type { Role } from '@/api/roles/role.types';
import { InviteUserDialog } from '@/components/InviteUserDialog';

const Users = () => {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [showInvite, setShowInvite] = useState<boolean>(false);
    const [showNewUser, setShowNewUser] = useState<boolean>(false);
    const [editUser, setEditUser] = useState<User | undefined>(undefined);
    const [manageRolesUser, setManageRolesUser] = useState<User | undefined>(undefined);
    const { isSidebarOpen, toggleSidebar } = useChatStore();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [count, setCount] = useState(25);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getUserList({
                count,
                offset,
                query: searchQuery ? {
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { username: { $regex: searchQuery, $options: 'i' } },
                    ]
                } : undefined,
            });
            
            if (response.success) {
                setUsers(response.users);
                setTotal(response.total);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch users',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const response = await userService.deleteUser({ userId });
            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'User deleted successfully',
                });
                fetchUsers();
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete user',
                variant: 'destructive',
            });
        }
    };

    const handleUpdateUser = async (userId: string, data: any) => {
        try {
            const response = await userService.updateUser({
                userId,
                data
            });
            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'User updated successfully',
                });
                fetchUsers();
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update user',
                variant: 'destructive',
            });
        }
    };

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

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [searchQuery, selectedRole, offset, count]);

    const filteredUsers = users.filter(user => {
        if (selectedRole === 'all') return true;
        return user.roles?.includes(selectedRole);
    });

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
            <Sidebar />
            <div className="p-6 space-y-6 overflow-auto w-full">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className='flex items-center gap-3'>
                    <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={toggleSidebar}
                                  className="lg:hidden"
                                >
                                  <Menu className="h-5 w-5" />
                                </Button>
                    <h1 className="text-2xl font-semibold">Users</h1>

                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowInvite(true)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Invite
                        </Button>
                        <InviteUserDialog 
                            open={showInvite}
                            onClose={() => setShowInvite(false)}
                            onSuccess={fetchUsers}
                        />
                        <Button size="sm" onClick={() => setShowNewUser(true)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            New user
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-4 border-b">
                    <Button variant="ghost" className={selectedRole === 'all' ? 'border-b-2 border-primary rounded-none' : 'rounded-none'}
                        onClick={() => setSelectedRole('all')}>
                        All
                    </Button>
                    <Button variant="ghost" className={selectedRole === 'pending' ? 'border-b-2 border-primary rounded-none' : 'rounded-none'}
                        onClick={() => setSelectedRole('pending')}>
                        Pending ({users.filter(u => !u.active).length})
                    </Button>
                    <Button variant="ghost" className={selectedRole === 'active' ? 'border-b-2 border-primary rounded-none' : 'rounded-none'}
                        onClick={() => setSelectedRole('active')}>
                        Active ({users.filter(u => u.active).length})
                    </Button>
                    <Button variant="ghost" className={selectedRole === 'deactivated' ? 'border-b-2 border-primary rounded-none' : 'rounded-none'}
                        onClick={() => setSelectedRole('deactivated')}>
                        Deactivated
                    </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search Users"
                            className="pl-9 "
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="All roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All roles</SelectItem>
                            {roles.map((role) => (
                                <SelectItem key={role._id} value={role._id}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Users Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Name</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                {user.avatarUrl}
                                            </div>
                                            {user.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>
                                        <span className={
                                            user.status === 'offline' ? 'text-red-500' : user.status === 'online' ? 'text-green-500' : 'text-yellow-500'
                                        }>
                                            {user?.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                    <span className="sr-only">Actions</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setManageRolesUser(user)}>
                                                    Manage Roles
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    setEditUser(user);
                                                    setShowNewUser(true);
                                                }}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteUser(user._id)}>Delete</DropdownMenuItem>
                                                {user.active ? (
                                                    <DropdownMenuItem 
                                                        onClick={() => handleUpdateUser(user._id, { active: false })}
                                                        className="text-red-600"
                                                    >
                                                        Deactivate
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem 
                                                        onClick={() => handleUpdateUser(user._id, { active: true })}
                                                        className="text-green-600"
                                                    >
                                                        Activate
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Items per page:
                        <Select 
                            value={count.toString()} 
                            onValueChange={(value) => {
                                setCount(Number(value));
                                setOffset(0);
                            }}
                        >
                            <SelectTrigger className="w-[70px] ml-2">
                                <SelectValue placeholder={count.toString()} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Showing results {offset + 1} - {Math.min(offset + count, total)} of {total}
                        </span>
                        <div className="flex">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                disabled={offset === 0}
                                onClick={() => setOffset(prev => Math.max(0, prev - count))}
                            >
                                {"<"}
                            </Button>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                disabled={offset + count >= total}
                                onClick={() => setOffset(prev => prev + count)}
                            >
                                {">"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            <NewUserForm 
                isOpen={showNewUser}
                onClose={() => {
                    setShowNewUser(false);
                    setEditUser(undefined);
                }}
                onSuccess={fetchUsers}
                className="w-[400px]"
                editUser={editUser}
            />

            {/* Manage Roles Dialog */}
            {manageRolesUser && (
                <ManageUserRolesDialog
                    open={!!manageRolesUser}
                    onClose={() => setManageRolesUser(undefined)}
                    onSuccess={fetchUsers}
                    user={manageRolesUser}
                />
            )}
        </div>
    );
};

export default Users;
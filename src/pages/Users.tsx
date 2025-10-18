import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Mail, MoreVertical, Plus, Search, UserPlus } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { useChatStore } from '@/store/chatStore';

interface User {
    id: string;
    name: string;
    username: string;
    status: 'Active' | 'Pending' | 'Deactivated';
    avatar: string;
}

const Users = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const { isSidebarOpen, toggleSidebar } = useChatStore();

    const users: User[] = [
        { id: '1', name: 'Ajmal Aju', username: 'ajmal_cxbrx', status: 'Active', avatar: 'A' },
        { id: '2', name: 'Ajmal Aju', username: 'ajmalcxbrx', status: 'Active', avatar: 'A' },
        { id: '3', name: 'Hello World', username: 'helloworld', status: 'Active', avatar: 'H' },
        { id: '4', name: 'One', username: 'one', status: 'Pending', avatar: 'O' },
        { id: '5', name: 'Rocket Cat', username: 'rocket.cat', status: 'Deactivated', avatar: 'R' },
        { id: '6', name: 'User A', username: 'usera', status: 'Active', avatar: 'U' },
        { id: '7', name: 'Two', username: 'two', status: 'Active', avatar: 'T' },
    ];

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === 'all' ||
            (selectedRole === 'active' && user.status === 'Active') ||
            (selectedRole === 'pending' && user.status === 'Pending') ||
            (selectedRole === 'deactivated' && user.status === 'Deactivated');
        return matchesSearch && matchesRole;
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
            <div className="p-6 space-y-6 overflow-auto">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Users</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-2" />
                            Invite
                        </Button>
                        <Button size="sm">
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
                        Pending (0)
                    </Button>
                    <Button variant="ghost" className={selectedRole === 'active' ? 'border-b-2 border-primary rounded-none' : 'rounded-none'}
                        onClick={() => setSelectedRole('active')}>
                        Active
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="deactivated">Deactivated</SelectItem>
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
                                <TableHead>Registration status</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                {user.avatar}
                                            </div>
                                            {user.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>
                                        <span className={
                                            user.status === 'Active' ? 'text-green-500' :
                                                user.status === 'Pending' ? 'text-yellow-500' :
                                                    'text-red-500'
                                        }>
                                            {user.status}
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
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                                {user.status === 'Active' ? (
                                                    <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem className="text-green-600">Activate</DropdownMenuItem>
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
                        <Select defaultValue="25">
                            <SelectTrigger className="w-[70px] ml-2">
                                <SelectValue placeholder="25" />
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
                            Showing results 1 - 7 of 7
                        </span>
                        <div className="flex">
                            <Button variant="outline" size="icon" disabled>
                                {"<"}
                            </Button>
                            <Button variant="outline" size="icon" disabled>
                                {">"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div></div>
    );
};

export default Users;
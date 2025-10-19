import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';
import { ComboboxDemo } from './ui/combobox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { User } from '@/api/users/user.types';
import { teamService } from '@/api/teams/team.service';
import { CreateTeamRequest, Team } from '@/api/teams/team.types';

interface CreateTeamDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (newTeam: Team) => void;
}

export function CreateTeamDialog({ open, onOpenChange, onSuccess }: CreateTeamDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        members: [] as User[],
        isPrivate: false,
    });

    const handleChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateTeamName = (name: string) => /^[a-zA-Z0-9-_ ]+$/.test(name);

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast({
                title: 'Error',
                description: 'Team name is required',
                variant: 'destructive',
            });
            return;
        }

        if (!validateTeamName(formData.name)) {
            toast({
                title: 'Error',
                description: 'Team name can only contain letters, numbers, spaces, hyphens, and underscores',
                variant: 'destructive',
            });
            return;
        }


        const payload: CreateTeamRequest = {
            name: formData.name.trim(),
            type: formData.isPrivate ? 1 : 0,
            members: formData.members.map(user => user._id),
        };

        try {
            setLoading(true);
            const response = await teamService.createTeam(payload);

            if (response.success) {
                onSuccess && onSuccess(response.team);
                toast({
                    title: 'Success',
                    description: `Team "${response.team.name}" created successfully`,
                });
                onOpenChange(false);
                setFormData({ name: '', description: '', members: [], isPrivate: false });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to create team',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Team</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="e.g. Marketing Team"
                        />
                        <p className="text-xs text-muted-foreground">
                            No special characters except hyphens, underscores, or spaces
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Optional description for the team"
                            className="resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Members</Label>
                        <ComboboxDemo
                            onSelect={(user) => {
                                if (!formData.members.find(member => member._id === user._id)) {
                                    handleChange('members', [...formData.members, user]);
                                }
                            }}
                            selectedUserIds={formData.members.map(user => user._id)}
                        />
                        {formData.members.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.members.map((user) => (
                                    <Badge key={user._id} variant="secondary" className="flex items-center gap-1">
                                        <span>{user.name || user.username}</span>
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() =>
                                                handleChange('members', formData.members.filter(member => member._id !== user._id))
                                            }
                                        />
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="private">Private</Label>
                            <p className="text-xs text-muted-foreground">
                                Only invited members can join
                            </p>
                        </div>
                        <Switch
                            id="private"
                            checked={formData.isPrivate}
                            onCheckedChange={(checked) => handleChange('isPrivate', checked)}
                        />
                    </div>
                </div>

                <div className="flex justify-between">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

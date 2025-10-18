import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { channelService } from '@/api/channels/channel.service';
import { Textarea } from './ui/textarea';
import { ComboboxDemo } from './ui/combobox';

interface CreateChannelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateChannelDialog({ open, onOpenChange, onSuccess }: CreateChannelDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        topic: '',
        members: [] as string[],
        isPrivate: false,
    });

    const handleChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateChannelName = (name: string) => {
        // No spaces or special characters allowed
        return /^[a-zA-Z0-9-_]+$/.test(name);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast({
                title: 'Error',
                description: 'Channel name is required',
                variant: 'destructive',
            });
            return;
        }

        if (!validateChannelName(formData.name)) {
            toast({
                title: 'Error',
                description: 'Channel name can only contain letters, numbers, hyphens, and underscores',
                variant: 'destructive',
            });
            return;
        }

        try {
            setLoading(true);
            const response = await channelService.createChannel({
                name: formData.name,
                members: formData.members,
                extraData: {
                    topic: formData.topic,
                },
                readOnly: false,
            });

            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Channel created successfully',
                });
                onSuccess?.();
                onOpenChange(false);
                setFormData({
                    name: '',
                    topic: '',
                    members: [],
                    isPrivate: false,
                });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to create channel',
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
                    <DialogTitle>Create channel</DialogTitle>
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
                            placeholder="e.g. project-planning"
                        />
                        <p className="text-xs text-muted-foreground">
                            No spaces or special characters
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Textarea
                            id="topic"
                            value={formData.topic}
                            onChange={(e) => handleChange('topic', e.target.value)}
                            placeholder="Displayed next to name"
                            className="resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Members</Label>
                        <ComboboxDemo 
                            onSelect={(value) => {
                                if (!formData.members.includes(value)) {
                                    handleChange('members', [...formData.members, value]);
                                }
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="private">Private</Label>
                            <p className="text-xs text-muted-foreground">
                                People can only join by being invited
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
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
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
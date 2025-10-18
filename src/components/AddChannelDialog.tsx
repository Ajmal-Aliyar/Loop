import { useState } from 'react';
import { z } from 'zod';
import { useChatStore } from '@/store/chatStore';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const channelSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  type: z.enum(['team', 'discussion', 'channel', 'direct']),
});

interface AddChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddChannelDialog = ({ open, onOpenChange }: AddChannelDialogProps) => {
  const { toast } = useToast();
  const addChannel = useChatStore((state) => state.addChannel);
  const [name, setName] = useState('');
  const [type, setType] = useState<'team' | 'discussion' | 'channel' | 'direct'>('channel');
  const [errors, setErrors] = useState<{ name?: string }>({});

  const colors: Array<'green' | 'yellow' | 'blue' | 'pink'> = ['green', 'yellow', 'blue', 'pink'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = channelSchema.safeParse({ name, type });

    if (!result.success) {
      const fieldErrors: { name?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'name') {
          fieldErrors.name = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const newChannel = {
      id: Date.now().toString(),
      name: result.data.name,
      type: result.data.type,
      avatar: result.data.name[0].toUpperCase(),
      color: colors[Math.floor(Math.random() * colors.length)],
      ...(type === 'direct' && { status: 'online' as const }),
    };

    addChannel(newChannel);
    
    toast({
      title: 'Success!',
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} "${name}" has been created.`,
    });

    setName('');
    setType('channel');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New</DialogTitle>
          <DialogDescription>
            Add a new team, discussion, channel, or direct message
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel-type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger id="channel-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="discussion">Discussion</SelectItem>
                <SelectItem value="channel">Channel</SelectItem>
                <SelectItem value="direct">Direct Message</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-name">Name</Label>
            <Input
              id="channel-name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

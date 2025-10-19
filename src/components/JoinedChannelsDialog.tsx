import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { channelService } from '@/api/channels/channel.service';
import { cn } from '@/lib/utils';
import { Hash, Users, Lock, Search, MessageSquare, X } from 'lucide-react';
import type { JoinedChannel } from '@/api/channels/channel.types';

interface JoinedChannelsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChannelSelect?: (channel: JoinedChannel) => void;
}

export function JoinedChannelsDialog({ open, onOpenChange, onChannelSelect }: JoinedChannelsDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<JoinedChannel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<JoinedChannel | null>(null);

  const fetchJoinedChannels = async () => {
    try {
      setLoading(true);
      const response = await channelService.listJoinedChannels(0, 100);
      
      if (response.success && response.channels) {
        setChannels(response.channels);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch joined channels',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch joined channels',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchJoinedChannels();
    }
  }, [open]);

  const filteredChannels = channels.filter(channel =>
    channel.fname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChannelIcon = (channelType: string) => {
    switch (channelType) {
      case 'c': return <Hash className="h-4 w-4" />;
      case 'p': return <Lock className="h-4 w-4" />;
      case 'd': return <MessageSquare className="h-4 w-4" />;
      default: return <Hash className="h-4 w-4" />;
    }
  };

  const getChannelTypeLabel = (channelType: string) => {
    switch (channelType) {
      case 'c': return 'Public Channel';
      case 'p': return 'Private Channel';
      case 'd': return 'Direct Message';
      default: return 'Channel';
    }
  };

  const getChannelColor = (name: string): 'green' | 'yellow' | 'blue' | 'pink' => {
    const colors = ['green', 'yellow', 'blue', 'pink'];
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length] as 'green' | 'yellow' | 'blue' | 'pink';
  };

  const getAvatarBg = (color: string) => {
    switch (color) {
      case 'green': return 'bg-avatar-green';
      case 'yellow': return 'bg-avatar-yellow';
      case 'blue': return 'bg-avatar-blue';
      case 'pink': return 'bg-avatar-pink';
      default: return 'bg-muted';
    }
  };

  const handleChannelSelect = (channel: JoinedChannel) => {
    setSelectedChannel(channel);
    onChannelSelect?.(channel);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Joined Channels
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Channels List */}
          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">Loading channels...</div>
              </div>
            ) : filteredChannels.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">
                  {searchQuery ? 'No channels found matching your search' : 'No joined channels found'}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredChannels.map((channel) => (
                  <div
                    key={channel._id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedChannel?._id === channel._id
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted/50 border-border"
                    )}
                    onClick={() => handleChannelSelect(channel)}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded text-sm font-bold text-white",
                      getAvatarBg(getChannelColor(channel.name))
                    )}>
                      {channel.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Channel Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getChannelIcon(channel.t)}
                        <span className="font-medium text-sm truncate">
                          {channel.fname || channel.name}
                        </span>
                        {channel.broadcast && (
                          <Badge variant="secondary" className="text-xs">
                            Broadcast
                          </Badge>
                        )}
                        {channel.encrypted && (
                          <Badge variant="outline" className="text-xs">
                            🔒 Encrypted
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{getChannelTypeLabel(channel.t)}</span>
                        <span>•</span>
                        <span>{channel.usersCount} members</span>
                        {channel.topic && (
                          <>
                            <span>•</span>
                            <span className="truncate">{channel.topic}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Channel Stats */}
                    <div className="text-right text-xs text-muted-foreground">
                      <div>{channel.msgs} messages</div>
                      <div className="truncate max-w-[100px]" title={channel.u?.name || channel.u?.username}>
                        by {channel.u?.name || channel.u?.username}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              {filteredChannels.length} of {channels.length} channels
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

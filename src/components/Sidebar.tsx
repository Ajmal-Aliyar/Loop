import { useState, useEffect } from 'react';
import { Hash, MessageSquare, Users, Edit, Plus, MessageCircle, Home, Search, MoreVertical, LogOut } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useChannelStore } from '@/store/channelStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateChannelDialog } from '@/components/CreateChannelDialog';
import { EditWorkspaceDialog } from '@/components/EditWorkspaceDialog';
import { JoinedChannelsDialog } from '@/components/JoinedChannelsDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import type { IChannel } from '@/api/channels/channel.types';
import { useNavigate } from 'react-router-dom';
import { DropdownMenuSeparator } from './ui/dropdown-menu';
import { useAuthStore } from '@/store/authStore';

export const Sidebar = () => {
  const { selectedChannel, setSelectedChannel, isSidebarOpen, workspaceName } = useChatStore();
  const { channels: apiChannels, loading, initializeChannels } = useChannelStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showJoinedChannelsDialog, setShowJoinedChannelsDialog] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const {logout} = useAuthStore()
  
  // Initialize channels when component mounts
  useEffect(() => {
    initializeChannels();
  }, [initializeChannels]);

  // Helper function to map API channel to UI format
  const mapChannelToUI = (channel: IChannel) => ({
    id: channel._id,
    name: channel.fname || channel.name,
    type: (channel.t === 'c' ? 'channel' : channel.t === 'p' ? 'channel' : 'channel') as 'channel' | 'team' | 'discussion' | 'direct',
    avatar: channel.name.charAt(0).toUpperCase(),
    color: getChannelColor(channel.name),
    unread: 0, // You can implement unread count logic later
    owner: channel.u?.name || channel.u?.username || 'Unknown',
    status: undefined as 'online' | 'away' | 'busy' | undefined,
    topic: channel.topic,
    usersCount: channel.usersCount,
    isPrivate: channel.t === 'p',
  });

  // Helper function to get consistent colors for channels
  const getChannelColor = (name: string): 'green' | 'yellow' | 'blue' | 'pink' => {
    const colors = ['green', 'yellow', 'blue', 'pink'];
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length] as 'green' | 'yellow' | 'blue' | 'pink';
  };

  // Map API channels to UI format
  const channels = apiChannels.map(mapChannelToUI);

  const teams = channels.filter(c => c.type === 'team');
  const discussions = channels.filter(c => c.type === 'discussion');
  const channelsList = channels.filter(c => c.type === 'channel');
  const directMessages = channels.filter(c => c.type === 'direct');

  const getAvatarBg = (color: string) => {
    switch (color) {
      case 'green': return 'bg-avatar-green';
      case 'yellow': return 'bg-avatar-yellow';
      case 'blue': return 'bg-avatar-blue';
      case 'pink': return 'bg-avatar-pink';
      default: return 'bg-muted';
    }
  };
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-chat-sidebar transition-transform duration-300 lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Workspace Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <h2 className="text-lg font-semibold text-foreground">{workspaceName}</h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowEditDialog(true)}
            title="Edit workspace"
          >
            <Edit className="h-4 w-4" />
          </Button>

        </div>
      </div>

      {/* Dialogs */}
      <CreateChannelDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={() => {
          // Refresh channels list
          const fetchChannels = useChannelStore.getState().fetchChannels;
          if (fetchChannels) fetchChannels();
        }}
       />
       <EditWorkspaceDialog open={showEditDialog} onOpenChange={setShowEditDialog} />
       <JoinedChannelsDialog 
         open={showJoinedChannelsDialog} 
         onOpenChange={setShowJoinedChannelsDialog}
         onChannelSelect={(channel) => {
           // Map the joined channel to UI format and set as selected
           const mappedChannel = {
             id: channel._id,
             name: channel.fname || channel.name,
             type: (channel.t === 'c' ? 'channel' : channel.t === 'p' ? 'channel' : 'channel') as 'channel' | 'team' | 'discussion' | 'direct',
             avatar: channel.name.charAt(0).toUpperCase(),
             color: getChannelColor(channel.name),
             unread: 0,
             owner: channel.u?.name || channel.u?.username || 'Unknown',
             status: undefined as 'online' | 'away' | 'busy' | undefined,
             topic: channel.topic,
             usersCount: channel.usersCount,
             isPrivate: channel.t === 'p',
           };
           setSelectedChannel(mappedChannel);
         }}
       />

      <div className="flex items-center gap-3 p-1">
        <Button variant="ghost" size="icon" className="flex" onClick={() => {
          setSelectedChannel(null)
          navigate('/')
          }}>
          <Home className="h-5 w-5" />
        </Button>
         <Button 
           variant="ghost" 
           size="icon" 
           onClick={() => setShowJoinedChannelsDialog(true)}
           title="View joined channels"
         >
           <Search className="h-5 w-5" />
         </Button>

        <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />

            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 cursor-pointer">
            <DropdownMenuItem>
              <span className="text-sm">Direct message</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="text-sm">Discussion</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="text-sm" onClick={() => {
                setShowAddDialog(true);
                setOpenMenu(false);
              }}>Channel</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="text-sm">Team</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="text-sm">Outbound message</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className='flex items-center'>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>


      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-3">
          {/* Teams */}
          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Teams
            </h3>
            <div className="space-y-1">
              {teams.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                    selectedChannel?.id === channel.id
                      ? "bg-chat-sidebar-active"
                      : "hover:bg-chat-sidebar-hover"
                  )}
                >
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-white", getAvatarBg(channel.color))}>
                    {channel.avatar}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{channel.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Discussions */}
          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Discussions
            </h3>
            <div className="space-y-1">
              {discussions.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                    selectedChannel?.id === channel.id
                      ? "bg-chat-sidebar-active"
                      : "hover:bg-chat-sidebar-hover"
                  )}
                >
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-white", getAvatarBg(channel.color))}>
                    {channel.avatar}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{channel.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Channels */}
          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Channels
            </h3>
            <div className="space-y-1">
              {loading ? (
                <div className="px-2 py-2 text-sm text-muted-foreground">
                  Loading channels...
                </div>
              ) : channelsList.length === 0 ? (
                <div className="px-2 py-2 text-sm text-muted-foreground">
                  No channels found
                </div>
              ) : (
                channelsList.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                      selectedChannel?.id === channel.id
                        ? "bg-chat-sidebar-active"
                        : "hover:bg-chat-sidebar-hover"
                    )}
                    title={`Owner: ${channel.owner}${channel.usersCount ? ` | ${channel.usersCount} members` : ''}${channel.topic ? ` | ${channel.topic}` : ''}`}
                  >
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-white", getAvatarBg(channel.color))}>
                      {channel.avatar}
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{channel.name}</span>
                      {channel.isPrivate && (
                        <span className="text-xs text-muted-foreground">🔒</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Direct messages
            </h3>
            <div className="space-y-1">
              {directMessages.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                    selectedChannel?.id === channel.id
                      ? "bg-chat-sidebar-active"
                      : "hover:bg-chat-sidebar-hover"
                  )}
                >
                  <div className="relative">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-white", getAvatarBg(channel.color))}>
                      {channel.avatar}
                    </div>
                    {channel.status && (
                      <div className={cn(
                        "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-chat-sidebar",
                        channel.status === 'online' && "bg-status-online",
                        channel.status === 'away' && "bg-status-away",
                        channel.status === 'busy' && "bg-status-busy"
                      )} />
                    )}
                  </div>
                  <span className="text-sm text-foreground">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

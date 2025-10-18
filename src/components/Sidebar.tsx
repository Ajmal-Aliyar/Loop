import { useState } from 'react';
import { Hash, MessageSquare, Users, Edit, Plus } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AddChannelDialog } from '@/components/AddChannelDialog';
import { EditWorkspaceDialog } from '@/components/EditWorkspaceDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

export const Sidebar = () => {
  const { channels, selectedChannel, setSelectedChannel, isSidebarOpen, workspaceName } = useChatStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

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
          

          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Manage Roles
              </DropdownMenuItem>
              <DropdownMenuItem >Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>

      {/* Dialogs */}
      <AddChannelDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <EditWorkspaceDialog open={showEditDialog} onOpenChange={setShowEditDialog} />

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
              {channelsList.map((channel) => (
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
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{channel.name}</span>
                  </div>
                </button>
              ))}
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

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-avatar-pink">rocket.chat</span>
            <span className="text-xs text-muted-foreground">Powered by Rocket.Chat</span>
            <span className="text-xs text-muted-foreground">Community</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

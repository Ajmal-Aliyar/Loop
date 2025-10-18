import { useState } from 'react';
import { Home, Search, Menu, Plus, Edit, MoreVertical } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { Sidebar } from '@/components/Sidebar';
import { HomeView } from '@/components/HomeView';
import { ChatView } from '@/components/ChatView';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ChatLayout = () => {
  const { selectedChannel, isSidebarOpen, toggleSidebar } = useChatStore();
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden lg:flex">
              <Home className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            <DropdownMenu open={showCreateMenu} onOpenChange={setShowCreateMenu}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Plus className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem>
                  <span className="text-sm">Direct message</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-sm">Discussion</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-sm">Channel</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-sm">Team</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-sm">Outbound message</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="hidden lg:flex">
              <Edit className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden lg:flex">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {selectedChannel && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{selectedChannel.name}</span>
            </div>
          )}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          {selectedChannel ? <ChatView /> : <HomeView />}
        </main>
      </div>
    </div>
  );
};

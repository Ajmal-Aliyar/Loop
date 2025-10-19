import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Users2, Video } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { Sidebar } from '@/components/Sidebar';
import { HomeView } from '@/components/HomeView';
import { ChatView } from '@/components/ChatView';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export const ChatLayout = () => {
  const navigate = useNavigate();
  const { selectedChannel, isSidebarOpen, toggleSidebar, startCall, user } = useChatStore();
  const { logout } = useAuthStore()


  const handleStartVoiceCall = () => {
    startCall('voice');
    navigate('/voice-call');
  };

  const handleStartVideoCall = () => {
    startCall('video');
    navigate('/video-call');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

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
          <div className="flex items-center gap-2">
            {selectedChannel && (
              <>
                <span className="text-sm font-medium">{selectedChannel.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStartVoiceCall}
                  title="Start voice call"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStartVideoCall}
                  title="Start video call"
                >
                  <Video className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStartVideoCall}
                  title="Start video call"
                >
                  <Users2 className="h-4 w-4" />
                </Button>
              </>
            )}

          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          {selectedChannel ? <ChatView /> : <HomeView />}
        </main>
      </div>
    </div>
  );
};

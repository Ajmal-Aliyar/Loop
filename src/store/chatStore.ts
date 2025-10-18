import { create } from 'zustand';

interface Channel {
  id: string;
  name: string;
  type: 'team' | 'discussion' | 'channel' | 'direct';
  avatar: string;
  color: 'green' | 'yellow' | 'blue' | 'pink';
  status?: 'online' | 'away' | 'busy';
  unread?: number;
}

interface ChatState {
  selectedChannel: Channel | null;
  channels: Channel[];
  isSidebarOpen: boolean;
  setSelectedChannel: (channel: Channel | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  selectedChannel: null,
  isSidebarOpen: true,
  channels: [
    { id: '1', name: 'python', type: 'team', avatar: 'P', color: 'green' },
    { id: '2', name: 'Test', type: 'discussion', avatar: 'P', color: 'green' },
    { id: '3', name: 'openchat', type: 'channel', avatar: 'O', color: 'yellow' },
    { id: '4', name: 'ok', type: 'channel', avatar: 'O', color: 'yellow' },
    { id: '5', name: 'world', type: 'channel', avatar: 'W', color: 'blue' },
    { id: '6', name: 'helloworld', type: 'direct', avatar: 'H', color: 'blue', status: 'online' },
  ],
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));

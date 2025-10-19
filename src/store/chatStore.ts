import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Channel {
  id: string;
  name: string;
  type: 'team' | 'discussion' | 'channel' | 'direct';
  avatar: string;
  color?: 'green' | 'yellow' | 'blue' | 'pink';
  status?: 'online' | 'away' | 'busy';
  unread?: number;
  owner?: string;
  topic?: string;
  usersCount?: number;
  isPrivate?: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface ChatState {
  user: User | null;
  selectedChannel: Channel | null;
  channels: Channel[];
  isSidebarOpen: boolean;
  isInCall: boolean;
  callType: 'voice' | 'video' | null;
  workspaceName: string;
  setUser: (user: User | null) => void;
  logout: () => void;
  setSelectedChannel: (channel: Channel | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  startCall: (type: 'voice' | 'video') => void;
  endCall: () => void;
  addChannel: (channel: Channel) => void;
  setWorkspaceName: (name: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      user: null,
      selectedChannel: null,
      isSidebarOpen: true,
      isInCall: false,
      callType: null,
      workspaceName: 'Omnichannel',
      channels: [
        { id: '1', name: 'python', type: 'team', avatar: 'P', color: 'green' },
        { id: '2', name: 'Test', type: 'discussion', avatar: 'P', color: 'green' },
        { id: '3', name: 'openchat', type: 'channel', avatar: 'O', color: 'yellow' },
        { id: '4', name: 'ok', type: 'channel', avatar: 'O', color: 'yellow' },
        { id: '5', name: 'world', type: 'channel', avatar: 'W', color: 'blue' },
        { id: '6', name: 'helloworld', type: 'direct', avatar: 'H', color: 'blue', status: 'online' },
      ],
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, selectedChannel: null }),
      setSelectedChannel: (channel) => set({ selectedChannel: channel }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      startCall: (type) => set({ isInCall: true, callType: type }),
      endCall: () => set({ isInCall: false, callType: null }),
      addChannel: (channel) => set((state) => ({ channels: [...state.channels, channel] })),
      setWorkspaceName: (name) => set({ workspaceName: name }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ user: state.user, channels: state.channels, workspaceName: state.workspaceName }),
    }
  )
);

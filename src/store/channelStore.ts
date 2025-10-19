import { create } from 'zustand';
import { channelService } from '@/api/channels/channel.service';
import type { IChannel } from '@/api/channels/channel.types';

interface ChannelState {
  channels: IChannel[];
  selectedChannel: IChannel | null;
  loading: boolean;
  error: string | null;
  // Actions
  setSelectedChannel: (channel: IChannel | null) => void;
  fetchChannels: () => Promise<void>;
  initializeChannels: () => Promise<void>;
}

export const useChannelStore = create<ChannelState>((set) => ({
  channels: [],
  selectedChannel: null,
  loading: false,
  error: null,

  setSelectedChannel: (channel) => set({ selectedChannel: channel }),

  fetchChannels: async () => {
    try {
      set({ loading: true, error: null });
      const response = await channelService.listChannels({
        count: 50, // You can adjust this as needed
        offset: 0,
      });
      
      if (response.success && response.channels) {
        set({
          channels: response.channels,
          loading: false,
        });
      } else {
        set({
          error: 'Failed to fetch channels',
          loading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch channels',
        loading: false,
      });
    }
  },

  initializeChannels: async () => {
    const { channels, loading } = useChannelStore.getState();
    if (channels.length === 0 && !loading) {
      await useChannelStore.getState().fetchChannels();
    }
  },
}));
import { create } from 'zustand';
import { chatService } from '@/api/chat/chat.service';
import type { ChatMessage, PostMessageRequest } from '@/api/chat/chat.types';

interface MessageState {
  messages: Record<string, ChatMessage[]>; // roomId -> messages
  loading: boolean;
  error: string | null;
  sending: boolean;
  // Actions
  fetchMessages: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, text: string) => Promise<void>;
  addMessage: (roomId: string, message: ChatMessage) => void;
  clearMessages: (roomId: string) => void;
  setSending: (sending: boolean) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: {},
  loading: false,
  error: null,
  sending: false,

  fetchMessages: async (roomId: string) => {
    try {
      set({ loading: true, error: null });
      
      // For now, we'll use channel history to get messages
      // You can implement a specific chat history endpoint later
      const { channelService } = await import('@/api/channels/channel.service');
      const response = await channelService.getChannelHistory({
        roomId,
        count: 50,
        offset: 0,
      });
      
      if (response.success && response.messages) {
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: response.messages.reverse() || []
          },
          loading: false,
        }));
      } else {
        set({
          error: 'Failed to fetch messages',
          loading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch messages',
        loading: false,
      });
    }
  },

  sendMessage: async (roomId: string, text: string) => {
    try {
      set({ sending: true, error: null });
      
      const response = await chatService.postMessage({
        channel: roomId,
        text: text,
      });
      
      if (response.success && response.message) {
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: [
              ...(state.messages[roomId] || []),
              response.message
            ]
          },
          sending: false,
        }));
      } else {
        set({
          error: 'Failed to send message',
          sending: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to send message',
        sending: false,
      });
      throw error;
    }
  },

  addMessage: (roomId: string, message: ChatMessage) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [
          ...(state.messages[roomId] || []),
          message
        ]
      }
    }));
  },

  clearMessages: (roomId: string) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: []
      }
    }));
  },

  setSending: (sending: boolean) => {
    set({ sending });
  },
}));

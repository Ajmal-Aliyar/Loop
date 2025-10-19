import { create } from 'zustand';
import { userService } from '@/api/users/user.service';
import type { User } from '@/api/users/user.types';

interface UserState {
  users: User[];
  selectedUsers: User[];
  loading: boolean;
  error: string | null;
  // Actions
  fetchUsers: () => Promise<void>;
  setSelectedUsers: (users: User[]) => void;
  addSelectedUser: (user: User) => void;
  removeSelectedUser: (userId: string) => void;
  clearSelectedUsers: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUsers: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ loading: true, error: null });
      const response = await userService.getUserList({
        count: 100, // You can adjust this as needed
        offset: 0,
      });
      
      if (response.success && response.users) {
        set({
          users: response.users,
          loading: false,
        });
      } else {
        set({
          error: 'Failed to fetch users',
          loading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch users',
        loading: false,
      });
    }
  },

  setSelectedUsers: (users) => set({ selectedUsers: users }),

  addSelectedUser: (user) => {
    const { selectedUsers } = get();
    if (!selectedUsers.find(u => u._id === user._id)) {
      set({ selectedUsers: [...selectedUsers, user] });
    }
  },

  removeSelectedUser: (userId) => {
    const { selectedUsers } = get();
    set({ selectedUsers: selectedUsers.filter(u => u._id !== userId) });
  },

  clearSelectedUsers: () => set({ selectedUsers: [] }),
}));

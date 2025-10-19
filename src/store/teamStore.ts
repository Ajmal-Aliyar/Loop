// src/store/teamStore.ts
import { create } from 'zustand';
import { Team } from '@/api/teams/team.types';
import { teamService } from '@/api/teams/team.service';

interface TeamState {
  teams: Team[];
  loading: boolean;
  error?: string;
  fetchTeams: () => Promise<void>;
  addTeam: (team: Team) => void;
  removeTeam: (teamId: string) => void;
  updateTeam: (updatedTeam: Team) => void;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  loading: false,
  error: undefined,

  fetchTeams: async () => {
    try {
      set({ loading: true, error: undefined });
      const res = await teamService.listTeams();
      if (res.success) {
        set({ teams: res.teams });
      } else {
        set({ error: 'Failed to fetch teams' });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch teams' });
    } finally {
      set({ loading: false });
    }
  },

  addTeam: (team: Team) => {
    set((state) => ({ teams: [team, ...state.teams] }));
  },

  removeTeam: (teamId: string) => {
    set((state) => ({ teams: state.teams.filter((t) => t._id !== teamId) }));
  },

  updateTeam: (updatedTeam: Team) => {
    set((state) => ({
      teams: state.teams.map((t) => (t._id === updatedTeam._id ? updatedTeam : t)),
    }));
  },
}));

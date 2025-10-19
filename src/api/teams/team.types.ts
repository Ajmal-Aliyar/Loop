// src/services/types/team.types.ts

// ---- Base Team Types ----
export interface Team {
  _id: string;
  name: string;
  type: number; // 0 = Public, 1 = Private
  createdAt: string;
  createdBy: {
    _id: string;
    username: string;
  };
  _updatedAt: string;
  roomId: string;
  rooms?: number;
  numberOfUsers?: number;
}

// ---- Response Types ----
export interface CreateTeamResponse {
  team: Team;
  success: boolean;
}

export interface ListTeamsResponse {
  teams: Team[];
  total: number;
  count: number;
  offset: number;
  success: boolean;
}

export interface AddMembersResponse {
  success: boolean;
}

export interface TeamMembersResponse {
  members: Array<{
    user: {
      _id: string;
      username: string;
      name?: string;
    };
    roles: string[];
    createdBy: {
      _id: string;
      username: string;
    };
    createdAt: string;
  }>;
  total: number;
  count: number;
  offset: number;
  success: boolean;
}

export interface LeaveTeamResponse {
  success: boolean;
}

export interface RemoveMemberResponse {
  success: boolean;
}

export interface DeleteTeamResponse {
  success: boolean;
}

// ---- Request Types ----
export interface CreateTeamRequest {
  name: string;
  type: 0 | 1;
  members?: string[];
  readOnly?: boolean;
  owner?: string;
}

export interface AddMembersRequest {
  teamId: string;
  members: Array<{
    userId: string;
    roles: string[];
  }>;
}

export interface RemoveMemberRequest {
  teamId: string;
  userId: string;
  rooms?: string[];
}

export interface LeaveTeamRequest {
  teamId: string;
  rooms: string[];
}

export interface DeleteTeamRequest {
  teamId?: string;
  teamName?: string;
  roomsToRemove?: string[];
}

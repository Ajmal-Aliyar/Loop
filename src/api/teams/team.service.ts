// src/services/team.service.ts
import axiosInstance from "@/lib/axios";
import {
  AddMembersRequest,
  AddMembersResponse,
  CreateTeamRequest,
  CreateTeamResponse,
  DeleteTeamRequest,
  DeleteTeamResponse,
  LeaveTeamRequest,
  LeaveTeamResponse,
  ListTeamsResponse,
  RemoveMemberRequest,
  RemoveMemberResponse,
  TeamMembersResponse,
} from "./team.types";

class TeamService {
  private baseURL = `/teams`;

  /** 🔹 Create a new team */
  async createTeam(data: CreateTeamRequest): Promise<CreateTeamResponse> {
    const res = await axiosInstance.post(`${this.baseURL}.create`, data);
    return res.data;
  }

  /** 🔹 List all teams the user is part of */
  async listTeams(): Promise<ListTeamsResponse> {
    const res = await axiosInstance.get(`${this.baseURL}.list`);
    return res.data;
  }

  /** 🔹 Add members to a team */
  async addMembers(data: AddMembersRequest): Promise<AddMembersResponse> {
    const res = await axiosInstance.post(`${this.baseURL}.addMembers`, data);
    return res.data;
  }

  /** 🔹 Get all members of a team */
  async getTeamMembers(teamId: string): Promise<TeamMembersResponse> {
    const res = await axiosInstance.get(`${this.baseURL}.members`, {
      params: { teamId },
    });
    return res.data;
  }

  /** 🔹 Leave a team */
  async leaveTeam(data: LeaveTeamRequest): Promise<LeaveTeamResponse> {
    const res = await axiosInstance.post(`${this.baseURL}.leave`, data);
    return res.data;
  }

  /** 🔹 Remove a member from a team */
  async removeMember(data: RemoveMemberRequest): Promise<RemoveMemberResponse> {
    const res = await axiosInstance.post(`${this.baseURL}.removeMember`, data);
    return res.data;
  }

  /** 🔹 Delete a team */
  async deleteTeam(data: DeleteTeamRequest): Promise<DeleteTeamResponse> {
    const res = await axiosInstance.post(`${this.baseURL}.delete`, data);
    return res.data;
  }
}

export const teamService = new TeamService();

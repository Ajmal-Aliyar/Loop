// src/services/role/role.service.ts

import axiosInstance from "@/lib/axios";
import {
  CreateRoleRequest,
  CreateRoleResponse,
  UpdateRoleRequest,
  UpdateRoleResponse,
  AddUserToRoleRequest,
  AddUserToRoleResponse,
  GetUsersInRoleParams,
  GetUsersInRoleResponse,
  GetRolesResponse,
  DeleteRoleRequest,
  DeleteRoleResponse,
  RemoveUserFromRoleRequest,
  RemoveUserFromRoleResponse,
} from "./role.types";

class RoleService {
  /** POST /roles.create */
  async createRole(payload: CreateRoleRequest): Promise<CreateRoleResponse> {
    const { data } = await axiosInstance.post<CreateRoleResponse>(
      "/roles.create",
      payload
    );
    return data;
  }

  /** POST /roles.update */
  async updateRole(payload: UpdateRoleRequest): Promise<UpdateRoleResponse> {
    const { data } = await axiosInstance.post<UpdateRoleResponse>(
      "/roles.update",
      payload
    );
    return data;
  }

  /** POST /roles.addUserToRole */
  async addUserToRole(payload: AddUserToRoleRequest): Promise<AddUserToRoleResponse> {
    const { data } = await axiosInstance.post<AddUserToRoleResponse>(
      "/roles.addUserToRole",
      payload
    );
    return data;
  }

  /** GET /roles.getUsersInRole */
  async getUsersInRole(params: GetUsersInRoleParams): Promise<GetUsersInRoleResponse> {
    const { data } = await axiosInstance.get<GetUsersInRoleResponse>(
      "/roles.getUsersInRole",
      { params }
    );
    return data;
  }

  /** GET /roles.list */
  async listRoles(): Promise<GetRolesResponse> {
    const { data } = await axiosInstance.get<GetRolesResponse>(
      "/roles.list"
    );
    return data;
  }

  /** POST /roles.delete */
  async deleteRole(payload: DeleteRoleRequest): Promise<DeleteRoleResponse> {
    const { data } = await axiosInstance.post<DeleteRoleResponse>(
      "/roles.delete",
      payload
    );
    return data;
  }

  /** POST /roles.removeUserFromRole */
  async removeUserFromRole(
    payload: RemoveUserFromRoleRequest
  ): Promise<RemoveUserFromRoleResponse> {
    const { data } = await axiosInstance.post<RemoveUserFromRoleResponse>(
      "/roles.removeUserFromRole",
      payload
    );
    return data;
  }
}

export const roleService = new RoleService();

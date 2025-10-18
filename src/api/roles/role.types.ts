// src/services/role/role.types.ts

export interface Role {
  _id: string;
  name: string;
  scope: string;
  description?: string;
  protected: boolean;
  mandatory2fa: boolean;
  _updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  scope?: string; // default: "Users"
  description?: string;
  mandatory2fa?: boolean; // default: false
}

export interface CreateRoleResponse {
  success: boolean;
  role: Role;
}

export interface UpdateRoleRequest {
  roleId: string;
  name: string;
  scope?: string;
  description?: string;
  mandatory2fa?: boolean;
}

export interface UpdateRoleResponse {
  success: boolean;
  role: Role;
}

export interface AddUserToRoleRequest {
  roleName?: string; // will be deprecated in 7.0.0
  roleId?: string;
  username: string;
  roomId?: string;
}

export interface AddUserToRoleResponse {
  success: boolean;
  role: Role;
}

export interface RemoveUserFromRoleRequest {
  roleId: string;
  username: string;
}

export interface RemoveUserFromRoleResponse {
  success: boolean;
}

export interface GetUsersInRoleParams {
  role: string;
  roomId?: string;
  offset?: number;
  count?: number;
}

export interface RoleUser {
  _id: string;
  username: string;
  type: string;
  status: string;
  active: boolean;
  name: string;
}

export interface GetUsersInRoleResponse {
  success: boolean;
  users: RoleUser[];
}

export interface GetRolesResponse {
  success: boolean;
  roles: Role[];
}

export interface DeleteRoleRequest {
  roleId: string;
}

export interface DeleteRoleResponse {
  success: boolean;
}

// src/services/user/user.types.ts

// -------------------------------------------
// Core User Model — matches your DB schema
// -------------------------------------------
export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  active: boolean;
  nickname?: string;
  avatarUrl?: string;
  bio?: string;
  joinDefaultChannels?: boolean;
  status?: string;
  roles?: string[];
}

// -------------------------------------------
// Common types for nested fields
// -------------------------------------------
export interface UserEmail {
  address: string;
  verified: boolean;
}

export interface UpdatedUser {
  _id: string;
  username: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  roles?: string[];
  active?: boolean;
  updatedAt?: string;
}

// -------------------------------------------
// API Response Types
// -------------------------------------------

// ✅ POST /api/v1/users.create
export interface CreateUserRequest {
  name: string;
  email: string;
  username: string;
  password: string;
  roles?: string[];
  active?: boolean;
}

export interface CreateUserResponse {
  success: boolean;
  user: User;
}

// ✅ POST /api/v1/users.update
export interface UpdateUserRequest {
  userId: string;
  data: Partial<Omit<User, "_id" | "email" | "password">>;
}

export interface UpdateUserResponse {
  success: boolean;
  user: UpdatedUser;
}

// ✅ GET /api/v1/users.info
export interface GetUserInfoParams {
  userId?: string;
  username?: string;
}

export interface GetUserInfoResponse {
  success: boolean;
  user: User;
}

// ✅ GET /api/v1/users.list
export interface GetUserListParams {
  count?: number;
  offset?: number;
  sort?: Record<string, 1 | -1>;
  query?: Record<string, any>;
}

export interface GetUserListResponse {
  success: boolean;
  users: User[];
  total: number;
  offset: number;
  count: number;
}

// ✅ POST /api/v1/users.delete
export interface DeleteUserRequest {
  userId: string;
}

export interface DeleteUserResponse {
  success: boolean;
  user: {
    _id: string;
    username: string;
  };
}

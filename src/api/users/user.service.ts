// src/services/user/user.service.ts
import axiosInstance from "@/lib/axios";
import {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  GetUserInfoParams,
  GetUserInfoResponse,
  GetUserListParams,
  GetUserListResponse,
  DeleteUserRequest,
  DeleteUserResponse,
} from "./user.types";

class UserService {
  /**
   * Create a new user
   * POST /users.create
   */
  async createUser(payload: CreateUserRequest): Promise<CreateUserResponse> {
    const { data } = await axiosInstance.post<CreateUserResponse>(
      "/users.create",
      payload
    );
    return data;
  }

  /**
   * Update user details
   * POST /users.update
   */
  async updateUser(payload: UpdateUserRequest): Promise<UpdateUserResponse> {
    const { data } = await axiosInstance.post<UpdateUserResponse>(
      "/users.update",
      payload
    );
    return data;
  }

  /**
   * Get user info by userId or username
   * GET /users.info
   */
  async getUserInfo(params: GetUserInfoParams): Promise<GetUserInfoResponse> {
    const { data } = await axiosInstance.get<GetUserInfoResponse>(
      "/users.info",
      { params }
    );
    return data;
  }

  /**
   * Get all users (supports pagination and filtering)
   * GET /users.list
   */
  async getUserList(params?: GetUserListParams): Promise<GetUserListResponse> {
    const { data } = await axiosInstance.get<GetUserListResponse>(
      "/users.list",
      { params }
    );
    return data;
  }

  /**
   * Delete a user
   * POST /users.delete
   */
  async deleteUser(payload: DeleteUserRequest): Promise<DeleteUserResponse> {
    const { data } = await axiosInstance.post<DeleteUserResponse>(
      "/users.delete",
      payload
    );
    return data;
  }
}

export const userService = new UserService();

import axiosInstance from "@/lib/axios";
import {
  LoginResponse,
  RegisterResponse,
  LoginCredentials,
  RegisterCredentials,
  RefreshTokenResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  User,
  AuthError
} from "./auth.types";
import { AxiosError } from "axios";

class AuthService {
  private handleError(error: unknown): never {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data as { message?: string; code?: string; field?: string };
      throw {
        message: errorData?.message || 'An unexpected error occurred',
        code: errorData?.code || error.code,
        field: errorData?.field,
      } as AuthError;
    }
    throw { message: 'An unexpected error occurred' } as AuthError;
  }

  async login({ email, password }: LoginCredentials): Promise<LoginResponse> {
    try {
      const { data } = await axiosInstance.post<{ data: LoginResponse }>('/login', {
        email,
        password,
      });
      return data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const { data } = await axiosInstance.post<{ data: RegisterResponse }>('/auth/register', credentials);
      return data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async me(): Promise<User> {
    try {
      const { data } = await axiosInstance.get<{ data: User }>('/auth/me');
      return data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/logout');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    try {
      await axiosInstance.post('/auth/reset-password', request);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    try {
      await axiosInstance.post('/auth/change-password', request);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(request: UpdateProfileRequest): Promise<User> {
    try {
      const { data } = await axiosInstance.patch<{ data: User }>('/auth/profile', request);
      return data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const authService = new AuthService();
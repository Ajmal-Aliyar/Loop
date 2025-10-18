export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
  createdAt: string;
  updatedAt: string;
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  username: string;
}

export interface LoginResponse {
  me: User;
  authToken: string;
  userId: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  avatar?: string;
}

export interface LogoutResponse {
  status: 'success' | 'error';
  message?: string;
  error?: {
    message: string;
    code: string;
  };
}
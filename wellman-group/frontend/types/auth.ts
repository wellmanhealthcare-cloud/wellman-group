export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface AdminUserUpdate {
  name?: string;
  email?: string;
}

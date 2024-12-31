// src/types/auth.ts
export interface User {
  firstName?: string;
  lastName?: string;
  email: string;
  grade?: string;
  profile_photo?: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
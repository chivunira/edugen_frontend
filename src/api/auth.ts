// src/api/auth.ts
import apiClient from './client';

export interface SignUpData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface VerifyCodeData {
  email: string;
  code: string;
}

export const authApi = {
  signUp: (data: SignUpData) =>
    apiClient.post('/auth/register/', {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    }),

  signIn: (data: SignInData) =>
    apiClient.post('/auth/login/', data),

  verifyCode: (data: VerifyCodeData) =>
    apiClient.post('/auth/verify-code/', {
      email: data.email,
      code: data.code
    }),

  resendCode: (email: string) =>
    apiClient.post('/auth/resend-code/', { email }),

  updateGrade: (grade: string) =>
    apiClient.patch('/auth/update-grade/', { grade }),

  logout: () =>
    apiClient.post('/auth/logout/', {
      refresh: localStorage.getItem('refreshToken')
    })
};
// src/types/api.ts
import { AxiosError } from 'axios';

export interface ApiError {
  error: string;
  detail?: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export type CustomAxiosError = AxiosError<ApiError>;
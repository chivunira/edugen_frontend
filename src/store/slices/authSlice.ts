// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, SignUpData } from '../../api/auth';
import { CustomAxiosError } from '../../types/api';


interface SignInData {
  email: string;
  password: string;
}

interface VerifyCodeData {
  email: string;
  code: string;
}

interface User {
  firstName?: string;
  lastName?: string;
  email: string;
  grade?: string;
  profile_photo?: string | null;
}

// Async thunks
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data: SignUpData, { rejectWithValue }) => {
    try {
      const response = await authApi.signUp(data);
      return response.data;
    } catch (error) {
      const customError = error as CustomAxiosError;
      return rejectWithValue(
        customError.response?.data?.error ||
        customError.response?.data?.detail ||
        'Registration failed'
      );
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: SignInData, { rejectWithValue }) => {
    try {
      const response = await authApi.signIn(credentials);
      const { access, refresh } = response.data;

      // Store tokens in localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      return response.data;
    } catch (error) {
      const customError = error as CustomAxiosError;
      return rejectWithValue(
        customError.response?.data?.error ||
        customError.response?.data?.detail ||
        'Login failed'
      );
    }
  }
);

export const updateGrade = createAsyncThunk(
  'auth/updateGrade',
  async (grade: string, { rejectWithValue }) => {
    try {
      const response = await authApi.updateGrade(grade);
      return { ...response.data, grade };
    } catch (error) {
      const customError = error as CustomAxiosError;
      return rejectWithValue(
        customError.response?.data?.error ||
        'Failed to update grade. Please try again.'
      );
    }
  }
);

export const verifyCode = createAsyncThunk(
  'auth/verifyCode',
  async (data: VerifyCodeData, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyCode(data);
      return response.data;
    } catch (error) {
      const customError = error as CustomAxiosError;
      return rejectWithValue(
        customError.response?.data?.error ||
        customError.response?.data?.detail ||
        'Verification failed'
      );
    }
  }
);

export const resendCode = createAsyncThunk(
  'auth/resendCode',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authApi.resendCode(email);
      return response.data;
    } catch (error) {
      const customError = error as CustomAxiosError;
      return rejectWithValue(
        customError.response?.data?.error ||
        customError.response?.data?.detail ||
        'Failed to resend verification code'
      );
    }
  }
);

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  verificationEmail: string | null;
  verificationStatus: 'idle' | 'pending' | 'success' | 'failed';
  resendStatus: 'idle' | 'pending' | 'success' | 'failed';
  gradeUpdateStatus: 'idle' | 'pending' | 'success' | 'failed';
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  verificationEmail: null,
  verificationStatus: 'idle',
  resendStatus: 'idle',
  gradeUpdateStatus: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      if (action.payload.user?.email) {
        state.verificationEmail = action.payload.user.email;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    resetGradeStatus: (state) => {
      state.gradeUpdateStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationEmail = action.meta.arg.email;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signIn.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateGrade.pending, (state) => {
        state.gradeUpdateStatus = 'pending';
        state.error = null;
      })
      .addCase(updateGrade.fulfilled, (state, action) => {
        state.gradeUpdateStatus = 'success';
        if (state.user) {
          state.user.grade = action.meta.arg;
        }
      })
      .addCase(updateGrade.rejected, (state, action) => {
        state.gradeUpdateStatus = 'failed';
        state.error = action.payload as string;
      })
    .addCase(verifyCode.pending, (state) => {
      state.verificationStatus = 'pending';
      state.error = null;
    })
    .addCase(verifyCode.fulfilled, (state, action) => {
      state.verificationStatus = 'success';
      state.isAuthenticated = true;
      state.user = action.payload.user;
    })
    .addCase(verifyCode.rejected, (state, action) => {
      state.verificationStatus = 'failed';
      state.error = action.payload as string;
    })

    // Resend Code
    .addCase(resendCode.pending, (state) => {
      state.resendStatus = 'pending';
      state.error = null;
    })
    .addCase(resendCode.fulfilled, (state) => {
      state.resendStatus = 'success';
    })
    .addCase(resendCode.rejected, (state, action) => {
      state.resendStatus = 'failed';
      state.error = action.payload as string;
    });
  },
});

export const { clearError, resetGradeStatus, logout, setAuthState } = authSlice.actions;
export default authSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import api from '../api/axiosInstance';
import type { AuthState, UserData, AuthResponse, LoginPayload, User } from '../types/auth';

function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    if (data?.error) return data.error;
  }
  return fallback;
}

export const fetchMe = createAsyncThunk<User>(
  'auth/me',
  async () => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  }
);

export const registerUser = createAsyncThunk<AuthResponse, UserData, { rejectValue: string }>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Could not create account'));
    }
  }
);

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Could not sign in'));
    }
  }
);

const initialState: AuthState = {
  user: null,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'resolved';
      })
      .addCase(fetchMe.rejected, (state) => {
        state.status = 'resolved';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

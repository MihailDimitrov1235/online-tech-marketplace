import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';
import type { AuthState, UserData, AuthResponse, LoginPayload, User } from '../types/auth';

export const fetchMe = createAsyncThunk<User>(
  'auth/me',
  async () => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  }
);

export const registerUser = createAsyncThunk<AuthResponse, UserData>(
  'auth/register',
  async (payload) => {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    return response.data;
  }
);

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload>(
  'auth/login',
  async (payload) => {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    return response.data;
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

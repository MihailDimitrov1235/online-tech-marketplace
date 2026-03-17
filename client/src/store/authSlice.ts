// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';
import type { AuthState, UserData, AuthResponse, LoginPayload } from '../types/auth';

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
  token: localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
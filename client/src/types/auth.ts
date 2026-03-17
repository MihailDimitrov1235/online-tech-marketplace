export type UserData = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type LoginPayload = {
  username: string;
  password: string;
}

export type AuthResponse = {
  token: string;
}

export type AuthState = {
  token: string | null;
  // loading: boolean;
  // error: string | null;
}
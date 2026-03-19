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

export type User = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export type AuthResponse = {
  user: User;
  token: string;
}

export type AuthState = {
  user: User | null;
}

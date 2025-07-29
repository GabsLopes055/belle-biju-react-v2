export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  idUser: string;
  nome: string;
  username: string;
  createdAt: Date;
  roles: "ADMIN" | "USER";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  expirationTime: Date | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}

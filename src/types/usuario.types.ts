export interface Usuario {
  idUser: string;
  nome: string;
  username: string;
  roles: "ADMIN" | "USER";
  createdAt: Date;
}

export interface UsuarioFormData {
  nome: string;
  username: string;
  password: string;
  roles: "ADMIN" | "USER";
}

export interface UsuarioRequest {
  nome: string;
  username: string;
  password: string;
  roles: "ADMIN" | "USER";
}

export interface UsuarioResponse {
  idUser: string;
  nome: string;
  username: string;
  roles: "ADMIN" | "USER";
  createdAt: Date;
}

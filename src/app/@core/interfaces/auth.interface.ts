import { ROLE } from "../enums/role.enum";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  role: ROLE
}

export interface SendValidateEmailRequest {
  email: string;
}

export interface SendEmailForgotPasswordRequest {
  email: string;
}

export interface ConfirmEmailRequest {
  code: string;
}

export interface UpdatePasswordRequest {
  uuid: string;
  password: string;
}

export interface UuidOfUpdatePasswordRequest {
  uuid: string;
}

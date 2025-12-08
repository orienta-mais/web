import { ROLE } from '../enums/role.enum';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  termsAccepted: boolean;
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

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface UpdatePasswordRequest {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface UuidOfUpdatePasswordRequest {
  uuid: string;
}

export interface UuidOfTokenRegisterRequest {
  token: string;
}

import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { jwtDecode } from 'jwt-decode';
import { ROLE } from '../../enums/role.enum';

export interface JwtPayload {
  id: string;
  sub: string;
  name?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private id: string = '';
  private name: string | null = null;
  private role: ROLE | null = null;
  private email: string | null = null;

  constructor(private authService: AuthService) {}

  getDecoded() {
    const token = this.authService.getAccessToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      console.warn('Token inválido ou corrompido');
      return null;
    }
  }

  getId(): string {
    return this.getDecoded()?.id ?? '';
  }

  getRole(): ROLE {
    return (this.getDecoded()?.role as ROLE) ?? null;
  }

  getEmail(): string {
    return this.getDecoded()?.sub ?? '';
  }

  getName(): string {
    return this.getDecoded()?.name ?? '';
  }

  logout() {
    this.authService.logout();
  }
}

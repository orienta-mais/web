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

  constructor(private authService: AuthService) {
    this.loadUserFromToken();
  }

  loadUserFromToken() {
    const token = this.authService.getAccessToken();
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      this.id = decoded.id;
      this.name = decoded.name ?? null;
      this.role = (decoded.role as ROLE) ?? null;
      this.email = decoded.sub ?? null;
    } catch (e) {
      console.error('Erro ao decodificar token:', e);
    }
  }

  getName(): string | null {
    return this.name;
  }

  getId(): string {
    return this.id;
  }

  getRole(): ROLE | null {
    return this.role;
  }

  getEmail(): string | null {
    return this.email;
  }

  clear() {
    this.name = null;
    this.role = null;
    this.email = null;
    this.authService.logout();
  }
}

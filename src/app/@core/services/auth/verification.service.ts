import { Injectable } from '@angular/core';
import { ROLE } from '../../enums/role.enum';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  private roleKey = 'role';
  private emailKey = 'verification_email';

  setPendingVerification(role: ROLE, email: string): void {
    localStorage.setItem(this.roleKey, role);
    localStorage.setItem(this.emailKey, email);
  }

  getEmail(): string | null {
    return localStorage.getItem(this.emailKey);
  }

  getRole(): ROLE | null {
    const role = localStorage.getItem(this.roleKey);
    return role ? (role as ROLE) : null;
  }

  hasVerificationPending(): boolean {
    return !!this.getEmail() && !!this.getRole();
  }

  clear(): void {
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.emailKey);
  }
}

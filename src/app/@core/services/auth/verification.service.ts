import { Injectable } from '@angular/core';
import { ROLE } from '../../enums/role.enum';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  private roleKey = 'role';
  private emailKey = 'verification_email';

  setPendingVerification(role: ROLE, email: string): void {
    sessionStorage.setItem(this.roleKey, role);
    sessionStorage.setItem(this.emailKey, email);
  }

  getEmail(): string | null {
    return sessionStorage.getItem(this.emailKey);
  }

  getRole(): ROLE | null {
    const role = sessionStorage.getItem(this.roleKey);
    return role ? (role as ROLE) : null;
  }

  hasVerificationPending(): boolean {
    return !!this.getEmail() && !!this.getRole();
  }

  clear(): void {
    sessionStorage.removeItem(this.roleKey);
    sessionStorage.removeItem(this.emailKey);
  }
}

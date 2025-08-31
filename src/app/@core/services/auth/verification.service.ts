import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  private pendingKey = 'pending_verification';
  private emailKey = 'verification_email';

  setPendingVerification(value: boolean, email: string) {
    sessionStorage.setItem(this.pendingKey, JSON.stringify(value));
    sessionStorage.setItem(this.emailKey, email);
  }

  getEmail(): string | null {
    return sessionStorage.getItem(this.emailKey);
  }

  hasVerificationPending(): boolean {
    return JSON.parse(sessionStorage.getItem(this.pendingKey) || 'false');
  }

  clear(): void {
    sessionStorage.removeItem(this.pendingKey);
    sessionStorage.removeItem(this.emailKey);
  }
}

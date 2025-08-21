import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private pendingVerification = false;

  setPendingVerification(value: boolean) {
    this.pendingVerification = value;
  }

  hasVerificationPending(): boolean {
    return this.pendingVerification;
  }
}
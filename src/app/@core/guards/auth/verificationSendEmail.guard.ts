import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { VerificationService } from '../../services/auth/verification.service';

@Injectable({ providedIn: 'root' })
export class VerificationGuard implements CanActivate {
  constructor(private verificationService: VerificationService, private router: Router) {}

  canActivate(): boolean {
    if (this.verificationService.hasVerificationPending()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
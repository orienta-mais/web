import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class TermsGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    const accepted = this.auth.getTermsAccepted();

    if (accepted === null || accepted === false) {
      this.router.navigate(['/accept-terms-of-use']);
      return false;
    }

    return true;
  }
}

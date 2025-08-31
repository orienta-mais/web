import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RegisterService } from '../../services/auth/register.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterGuard implements CanActivate {
  constructor(
    private registerService: RegisterService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    const email = this.registerService.getEmail();
    const password = this.registerService.getPassword();

    if (!email || !password) {
      this.router.navigate(['/register']);
      return false;
    }

    return true;
  }
}

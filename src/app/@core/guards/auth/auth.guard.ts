import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    try {
      const token = this.authService.getAccessToken();
      const isAuthenticated = !!token;
      const allowedRoles = route.data['roles'] || [];
      const userRole = this.userService.getRole();

      if (!isAuthenticated) {
        this.router.navigate(['/login']);
        return false;
      }

      if (!userRole) {
        this.router.navigate(['/home']);
        return false;
      }

      if (allowedRoles.length && !allowedRoles.includes(userRole)) {
        this.router.navigate(['/home']);
        return false;
      }

      return true;
    } catch (err) {
      console.error('AuthGuard Error:', err);
      this.router.navigate(['/login']);
      return false;
    }
  }
}

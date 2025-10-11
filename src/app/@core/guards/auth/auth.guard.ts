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
    const isAuthenticated = this.authService.isAuthenticated();
    const userRole = this.userService.getRole();
    const allowedRoles = route.data['roles'];

    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}

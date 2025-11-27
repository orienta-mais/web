import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { ROLE } from '../../enums/role.enum';

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
      console.log('Allowed Roles:', allowedRoles);
      const userRole = this.userService.getRole();
      console.log('User Role from Service:', userRole);

      if (!isAuthenticated) {
        this.router.navigate(['/login']);
        return false;
      }

      if (!userRole) {
        this.userService.loadUserFromToken();
      }

      const role = this.userService.getRole();

      if (!role) {
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
      }

      if (allowedRoles.length && !allowedRoles.includes(role)) {
        this.redirectToRoleHome(role);
        return false;
      }

      return true;
    } catch (err) {
      console.error('AuthGuard Error:', err);
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }

  private redirectToRoleHome(role: ROLE) {
    if (role === ROLE.MENTOR) {
      this.router.navigate(['/mentor/lesson']);
    } else if (role === ROLE.MENTORED) {
      this.router.navigate(['/mentored/lesson']);
    } else if (role === ROLE.ADMIN) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}

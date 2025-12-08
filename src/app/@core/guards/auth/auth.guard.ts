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
      const userRole = this.userService.getRole();
      const termsAccepted = this.authService.getTermsAccepted();
      const currentRoute = route.routeConfig?.path;

      if (!isAuthenticated) {
        this.router.navigate(['/login']);
        return false;
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

      if (!termsAccepted) {
        if (currentRoute !== 'accept-terms-of-use') {
          this.router.navigate(['/accept-terms-of-use']);
          return false;
        }
      }

      if (termsAccepted && currentRoute === 'accept-terms-of-use') {
        this.router.navigate(['/home']);
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

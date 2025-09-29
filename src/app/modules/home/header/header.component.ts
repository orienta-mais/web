import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../@core/services/auth/auth.service';
import { ROLE } from '../../../@core/enums/role.enum';


@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  role: ROLE | null = this.authService.getRole();

  constructor(private authService: AuthService, private router: Router) {}

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
}}

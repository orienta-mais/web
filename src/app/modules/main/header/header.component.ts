import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE } from '../../../@core/enums/role.enum';
import { UserService } from '../../../@core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  role: ROLE | null = null;
  name: string | null = null;
  email: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userService.loadUserFromToken();
    this.role = this.userService.getRole();
    this.name = this.userService.getName();
    this.email = this.userService.getEmail();
  }

  logout() {
    this.userService.logout();
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}

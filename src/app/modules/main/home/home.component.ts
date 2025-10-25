import { Component } from '@angular/core';
import { UserService } from '../../../@core/services/user/user.service';
import { ROLE } from '../../../@core/enums/role.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  role: ROLE | null = null;
  name: string | null = null;

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.role = this.userService.getRole();
    this.name = this.userService.getName();
  }
}

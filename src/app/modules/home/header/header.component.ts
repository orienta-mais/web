import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type Role = 'mentor' | 'mentored';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  role: Role = 'mentored';
}

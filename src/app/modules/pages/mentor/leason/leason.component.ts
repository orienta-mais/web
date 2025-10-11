import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { LeasonService } from '../../../../@core/services/mentor/leason.service';
import { UserService } from '../../../../@core/services/user/user.service';
import { LeasonListResponse } from '../../../../@core/interfaces/mentor.interface';

@Component({
  selector: 'app-leason',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './leason.component.html',
  styleUrls: ['./leason.component.css'],
})
export class LeasonListComponent implements OnInit {
  leasons: LeasonListResponse[] = [];
  loading = false;

  constructor(
    private leasonService: LeasonService,
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loadLeasons();
  }

  loadLeasons() {
    this.leasons = [
      {
        id: '1',
        title: 'Aula de Angular',
        description: 'Aprendendo componentes e serviços',
        date: '2025-10-15',
        initialTime: '09:00',
        finalTime: '11:00',
      },
    ];
    this.loading = true;
    this.leasonService
      .findAllLeasons({ mentorId: this.userService.getId() })
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          //this.leasons = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  goToCreate() {
    this.router.navigate(['/leason/create-leason']);
  }

  showDetails() {
    console.log('Detalhes da aula:');
  }
}

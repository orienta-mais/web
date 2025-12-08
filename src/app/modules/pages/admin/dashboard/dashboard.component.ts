import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../@core/services/admin/admin.service';
import {
  CountLessons,
  CountMentoreds,
  CountMentors,
  CountState,
  CountStateList,
} from '../../../../@core/interfaces/dashboard.interface';
import { ButtonModule } from 'primeng/button';

import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChartModule } from 'primeng/chart';
import { forkJoin, take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ProgressSpinnerModule,
    ChartModule,
    ButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  mentors?: number | null;
  mentoreds?: number | null;
  upcomingLessons?: number | null;
  unavailableLessons?: number | null;

  states: CountState[] = [];

  loading = true;

  barData: any;
  barOptions: any;

  constructor(private dashboardService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;

    forkJoin({
      mentors: this.dashboardService.countMentors().pipe(take(1)),
      mentoreds: this.dashboardService.countMentoreds().pipe(take(1)),
      lessons: this.dashboardService.countLessons().pipe(take(1)),
      states: this.dashboardService.countState().pipe(take(1)),
    }).subscribe({
      next: ({ mentors, mentoreds, lessons, states }) => {
        this.mentors = mentors?.mentors ?? 0;
        this.mentoreds = mentoreds?.mentoreds ?? 0;
        this.upcomingLessons = lessons?.countUpcomingLessons ?? 0;
        this.unavailableLessons = lessons?.countUnavailableLessons ?? 0;

        this.states = (states?.total ?? []).filter(s => s.state != null);

        this.loadStateBarChart();
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  loadStateBarChart() {
    const labels = this.states.map((s) => s.state);
    const values = this.states.map((s) => s.totalRegistered);

    this.barData = {
      labels,
      datasets: [
        {
          label: 'Cadastros por Estado',
          data: values,
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#26C6DA',
            '#7E57C2',
            '#FF7043',
            '#9CCC65',
            '#AB47BC',
            '#29B6F6',
            '#EF5350',
          ],
          borderColor: '#ccc',
          borderWidth: 1,
        },
      ],
    };

    this.barOptions = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          beginAtZero: true,
        },
      },
    };
  }

  exportCSV() {
    const headers = ['Estado', 'Total Registrados'];

    const rows = this.states.map((s) => [s.state, s.totalRegistered]);

    let csvContent =
      'data:text/csv;charset=utf-8,' + [headers, ...rows].map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'estados-dashboard.csv');
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  }
}

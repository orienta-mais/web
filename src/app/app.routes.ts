import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./modules/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'home', 
    loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent) 
  },
  { path: '**', redirectTo: 'login' },
];

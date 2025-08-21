import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent) 
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./modules/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'register-send-email-validate',
    loadComponent: () => import('./modules/auth/send-validate-email/send-validate-email.component').then(m => m.SendValidateEmailComponent)
  },
  { 
    path: 'home', 
    loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent) 
  },
  { path: '**', redirectTo: 'login' },
];

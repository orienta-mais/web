import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { SendValidateEmailComponent } from './modules/auth/send-validate-email/send-validate-email.component';
import { HomeComponent } from './modules/home/home.component';
import { UpdatePasswordComponent } from './modules/auth/update-password/update-password.component';
import { RegisterMentorComponent } from './modules/auth/register-user/register-mentor/register-mentor.component';
import { RegisterMentoredComponent } from './modules/auth/register-user/register-mentored/register-mentored.component';
import { AuthGuard } from './@core/guards/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'password/reset/:uuid', component: UpdatePasswordComponent },
  { path: 'password/forgot', component: ForgotPasswordComponent },

  { path: 'register/email/send-validation', component: SendValidateEmailComponent },

  { path: 'home', component: HomeComponent, children: [], canActivate: [AuthGuard] },

  { path: 'register/mentor', component: RegisterMentorComponent },
  { path: 'register/mentored', component: RegisterMentoredComponent },

  { path: '**', redirectTo: 'login' },
];

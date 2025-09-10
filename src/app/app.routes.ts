import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { SendValidateEmailComponent } from './modules/auth/send-validate-email/send-validate-email.component';
import { HomeComponent } from './modules/home/home.component';
import { ConfirmEmailComponent } from './modules/auth/confirm-email/confirm-email.component';
import { UpdatePasswordComponent } from './modules/auth/update-password/update-password.component';
import { RegisterUserComponent } from './modules/auth/register-user/register-user.component';
import { RegisterMentorComponent } from './modules/auth/register-user/register-mentor/register-mentor.component';
import { RegisterMentoredComponent } from './modules/auth/register-user/register-mentored/register-mentored.component';

import { VerificationGuard } from '../app/@core/guards/auth/verificationSendEmail.guard';
import { RegisterGuard } from './@core/guards/auth/registerUser.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'password/reset/:uuid', component: UpdatePasswordComponent },
  { path: 'password/forgot', component: ForgotPasswordComponent },

  { path: 'register/email/send-validation', component: SendValidateEmailComponent },
  {
    path: 'register/email/confirm',
    component: ConfirmEmailComponent,
    canActivate: [VerificationGuard],
  },

  { path: 'home', component: HomeComponent, children: [
    
  ] },

  { path: 'register', component: RegisterUserComponent, canActivate: [VerificationGuard] },
  { path: 'register/mentor', component: RegisterMentorComponent, canActivate: [RegisterGuard] },
  { path: 'register/mentored', component: RegisterMentoredComponent, canActivate: [RegisterGuard] },

  { path: '**', redirectTo: 'login' },
];

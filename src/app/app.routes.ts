import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { SendValidateEmailComponent } from './modules/auth/send-validate-email/send-validate-email.component';
import { HomeComponent } from './modules/home/home.component';
import { UpdatePasswordComponent } from './modules/auth/update-password/update-password.component';
import { RegisterMentorComponent } from './modules/auth/register-user/register-mentor/register-mentor.component';
import { RegisterMentoredComponent } from './modules/auth/register-user/register-mentored/register-mentored.component';
import { AuthGuard } from './@core/guards/auth/auth.guard';
import { MeetingComponent } from './modules/pages/meeting/meeting.component';
import { ROLE } from './@core/enums/role.enum';
import { CreateLeasonComponent } from './modules/pages/mentor/lesson/create-lesson/create-lesson.component';
import { LessonListComponent } from './modules/pages/mentor/lesson/lesson.component';
import { LeasonDetailsComponent } from './modules/pages/mentor/lesson/lesson-details/lesson-details.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'password/reset/:uuid', component: UpdatePasswordComponent },
  { path: 'password/forgot', component: ForgotPasswordComponent },

  { path: 'register/email/send-validation', component: SendValidateEmailComponent },

  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'meeting', component: MeetingComponent },
      {
        path: 'lesson',
        component: LessonListComponent,
        canActivate: [AuthGuard],
        data: { roles: [ROLE.MENTOR] },
      },
      {
        path: 'lesson/create-leason',
        component: CreateLeasonComponent,
        canActivate: [AuthGuard],
        data: { roles: [ROLE.MENTOR] },
      },
      {
        path: 'lesson/details/:id',
        component: LeasonDetailsComponent,
        canActivate: [AuthGuard],
        data: { roles: [ROLE.MENTOR] },
      },
    ],
  },

  { path: 'register/mentor', component: RegisterMentorComponent },
  { path: 'register/mentored', component: RegisterMentoredComponent },

  { path: '**', redirectTo: 'login' },
];

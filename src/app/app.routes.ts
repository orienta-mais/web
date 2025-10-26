import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { SendValidateEmailComponent } from './modules/auth/send-validate-email/send-validate-email.component';
import { MainComponent } from './modules/main/main.component';
import { UpdatePasswordComponent } from './modules/auth/update-password/update-password.component';
import { RegisterMentorComponent } from './modules/auth/register-user/register-mentor/register-mentor.component';
import { RegisterMentoredComponent } from './modules/auth/register-user/register-mentored/register-mentored.component';
import { AuthGuard } from './@core/guards/auth/auth.guard';
import { MeetingComponent } from './modules/pages/meeting/meeting.component';
import { ROLE } from './@core/enums/role.enum';
import { CreateLeasonComponent } from './modules/pages/mentor/lesson/create-lesson/create-lesson.component';
import { LessonListComponent } from './modules/pages/mentor/lesson/lesson.component';
import { LeasonDetailsComponent } from './modules/pages/mentor/lesson/lesson-details/lesson-details.component';
import { MentoredLessonComponent } from './modules/pages/mentored/mentored-lesson/mentored-lesson.component';
import { MentorProfileDetailsComponent } from './modules/pages/mentor/profile/mentor-profile-details/mentor-profile-details.component';
import { MentoredLessonDetailsComponent } from './modules/pages/mentored/mentored-lesson/mentored-lesson-details/mentored-lesson-details.component';
import { HomeComponent } from './modules/main/home/home.component';
import { MentoredProfileComponent } from './modules/pages/mentored/mentored-profile/mentored-profile.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'password/reset/:uuid', component: UpdatePasswordComponent },
  { path: 'password/forgot', component: ForgotPasswordComponent },

  { path: 'register/email/send-validation', component: SendValidateEmailComponent },

  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: { roles: [ROLE.MENTOR, ROLE.MENTORED] },
      },
      {
        path: 'mentor/lesson',
        component: LessonListComponent,
        canActivate: [AuthGuard],
        data: { roles: [ROLE.MENTOR] },
      },
      {
        path: 'mentor/lesson/create-leason',
        component: CreateLeasonComponent,
        canActivate: [AuthGuard],
        data: { roles: [ROLE.MENTOR] },
      },
      {
        path: 'mentor/lesson/details/:id',
        component: LeasonDetailsComponent,
        canActivate: [AuthGuard],
        data: { roles: [ROLE.MENTOR] },
      },
      {
        path: 'mentored/lesson',
        component: MentoredLessonComponent,
        canActivate: [AuthGuard],
        data: { roles: [ROLE.MENTORED] },
      },
      {
        path: 'mentored/lesson/details/:id',
        component: MentoredLessonDetailsComponent,
        canActivate: [AuthGuard],
        data: { roles: [ROLE.MENTORED] },
      },
      {
        path: 'mentor/profile',
        component: MentorProfileDetailsComponent,
        canActivate: [AuthGuard],
        data: { roles: [ROLE.MENTOR] },
      },
      {
        path: 'mentored/profile',
        component: MentoredProfileComponent,
        canActivate: [AuthGuard],
        data: { roles: [ROLE.MENTORED] },
      },
    ],
  },

  { path: 'register/mentor', component: RegisterMentorComponent },
  { path: 'register/mentored', component: RegisterMentoredComponent },

  { path: '**', redirectTo: 'login' },
  {
    path: 'termos-de-uso',
    redirectTo: '/termos-de-uso.html',
    pathMatch: 'full',
  },
  {
    path: 'politica-de-privacidade',
    redirectTo: '/politica-de-privacidade.html',
    pathMatch: 'full',
  },
];

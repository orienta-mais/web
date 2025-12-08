import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../@core/services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { take } from 'rxjs';
import { UserService } from '../../../@core/services/user/user.service';
import { MentorService } from '../../../@core/services/mentor/mentor.service';
import { MentoredService } from '../../../@core/services/mentored/mentored.service';
import { ROLE } from '../../../@core/enums/role.enum';

@Component({
  selector: 'app-accept-of-terms',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './accept-of-terms.component.html',
  styleUrls: ['./accept-of-terms.component.css'],
})
export class AcceptOfTermsComponent {
  showRefuseBox = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private userService: UserService,
    private mentorService: MentorService,
    private mentoredService: MentoredService,
  ) {
    this.form = this.fb.group({
      accepted: [false],
    });
  }

  continue() {
    if (!this.form.value.accepted) return;
    this.authService
      .confirmTerms()
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toastService.success('Termos aceitos com sucesso!');
          this.authService.setTermsAccepted(true);
          this.router.navigate(['/home']);
        },
        error: () => {
          this.toastService.error('Erro ao aceitar os termos. Tente novamente.');
        },
      });
  }

  refuse() {
    this.showRefuseBox = true;
  }

  deleteAccount() {
    let role = this.userService.getRole();
    let userId = this.userService.getId();

    if (!role || !userId) {
      this.toastService.error('Erro ao identificar o usuário. Tente novamente.');
      return;
    }

    console.log(role, userId);
    if (role === ROLE.MENTOR) {
      this.mentorService
        .deleteAccount(userId)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.toastService.success('Conta deletada com sucesso.');
            this.authService.logout();
            this.router.navigate(['/login']);
          },
          error: () => {
            this.toastService.error('Erro ao deletar a conta. Tente novamente.');
          },
        });
    }

    if (role === ROLE.MENTORED) {
      this.mentoredService
        .deleteAccount(userId)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.toastService.success('Conta deletada com sucesso.');
            this.authService.logout();
            this.router.navigate(['/login']);
          },
          error: () => {
            this.toastService.error('Erro ao deletar a conta. Tente novamente.');
          },
        });
    }
  }
  cancelRefusal() {
    this.showRefuseBox = false;
  }
}

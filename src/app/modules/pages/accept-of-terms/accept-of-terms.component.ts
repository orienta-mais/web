import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../@core/services/auth/auth.service';
import { Router } from '@angular/router';

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
  ) {
    this.form = this.fb.group({
      accepted: [false],
    });
  }

  continue() {
    if (!this.form.value.accepted) return;
    this.authService.setTermsAccepted(true);
    this.router.navigate(['/home']);
    console.log('Termos aceitos!');
  }

  refuse() {
    this.showRefuseBox = true;
  }

  deleteAccount() {
    console.log('Conta será excluída');
  }
  cancelRefusal() {
    this.showRefuseBox = false;
  }
}

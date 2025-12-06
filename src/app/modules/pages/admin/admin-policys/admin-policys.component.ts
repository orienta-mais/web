import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { PolicyType } from '../../../../@core/enums/policy.enum';
import { AdminService } from '../../../../@core/services/admin/admin.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-admin-policy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-policys.component.html',
})
export class AdminPolicysComponent {
  policyTypes = PolicyType;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private toast: ToastService,
  ) {
    this.form = this.fb.group({
      type: [PolicyType.PRIVACY, Validators.required],
      content: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.adminService.savePolicy(this.form.value).subscribe({
      next: () => this.toast.success('Conteúdo salvo com sucesso!'),
      error: () => this.toast.error('Erro ao salvar conteúdo.'),
    });
  }
}

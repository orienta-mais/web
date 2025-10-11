import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastService } from '../../../../../shared/components/toast/toast.service';
import { MentorService } from '../../../../../@core/services/mentor/mentor.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../../../@core/services/user/user.service';
import { CreateLeason } from '../../../../../@core/interfaces/mentor.interface';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-create-leason',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
  ],
  templateUrl: './create-leason.component.html',
  styleUrls: ['./create-leason.component.css'],
})
export class CreateLeasonComponent {
  form: FormGroup;
  loading = false;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private mentorService: MentorService,
    private toast: ToastService,
    private userService: UserService,
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      date: [null, Validators.required],
      initialTime: ['', Validators.required],
      finalTime: ['', Validators.required],
    });
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, description, date, initialTime, finalTime } = this.form.value;

    const [hInit, mInit] = initialTime.split(':').map(Number);
    const [hEnd, mEnd] = finalTime.split(':').map(Number);
    const diffHours = hEnd + mEnd / 60 - (hInit + mInit / 60);

    if (diffHours <= 0) {
      this.toast.error('A hora de término deve ser posterior à de início.');
      return;
    }
    if (diffHours > 6) {
      this.toast.error('A aula não pode ter mais de 6 horas de duração.');
      return;
    }

    const mentorId = this.userService.getId();

    const payload: CreateLeason = {
      title,
      description,
      date: new Date(date).toISOString().split('T')[0],
      initialTime,
      finalTime,
      mentorId,
    };

    this.loading = true;

    this.mentorService
      .createLeason(payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('Aula cadastrada com sucesso!');
          this.form.reset();
          this.loading = false;
        },
        error: (e: HttpErrorResponse) => {
          this.toast.error(e.error?.error || 'Erro ao cadastrar aula.');
          this.loading = false;
        },
      });
  }

  get f() {
    return this.form.controls;
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MentorService } from '../../../../@core/services/mentor/mentor.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { take } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mentored-review-of-mentor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './mentored-review-of-mentor.component.html',
  styleUrl: './mentored-review-of-mentor.component.css',
})
export class MentoredReviewOfMentorComponent {
  mentorId!: string;
  mentor: any = null;
  feedbacks: any[] = [];
  showReviewForm = false;

  reviewForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private mentorService: MentorService,
    private fb: FormBuilder,
    private toast: ToastService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.mentorId = this.route.snapshot.paramMap.get('mentorId')!;
    this.initializeForm();
    this.loadMentorData();
  }

  initializeForm() {
    this.reviewForm = this.fb.group({
      didactics: [0, Validators.required],
      subjectMastery: [0, Validators.required],
      punctuality: [0, Validators.required],
      communication: [0, Validators.required],
      engagement: [0, Validators.required],
      feedback: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  loadMentorData() {
    this.mentorService
      .getMentorDetails(this.mentorId)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.mentor = data;
          this.feedbacks = data.feedbacks || [];
        },
        error: () => {
          this.toast.error('Erro ao carregar dados do mentor. Carregando dados mockados.');

          this.mentor = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'João Mentor',
            state: 'São Paulo',
            nationality: 'Brasil',
            linkedin: 'https://linkedin.com/in/joaomentor',
            description:
              'Mentor experiente em tecnologia, com foco em desenvolvimento e arquitetura.',
            feedbacks: [],
          };

          this.feedbacks = [
            {
              id: 'a1',
              mentoredId: 'm1',
              didactics: 5,
              subjectMastery: 5,
              punctuality: 5,
              communication: 5,
              engagement: 5,
              feedback: 'Excelente mentor! Muito didático e sempre pontual.',
            },
            {
              id: 'a2',
              mentoredId: 'm2',
              didactics: 5,
              subjectMastery: 5,
              punctuality: 5,
              communication: 5,
              engagement: 1,
              feedback: 'Ótima experiência, ajudou muito na minha evolução profissional.',
            },
          ];

          this.mentor.feedbacks = this.feedbacks;
        },
      });
  }

  toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm;
  }

  submitReview() {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.reviewForm.value,
      mentoredId: this.mentorId,
    };

    this.mentorService
      .sendFeedback(this.mentorId, payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('Feedback enviado com sucesso!');
          this.feedbacks.push(payload);
          this.showReviewForm = false;
          this.reviewForm.reset();
        },
        error: () => {
          this.toast.error('Erro ao enviar feedback.');
        },
      });
  }

  getAverage() {
    if (!this.feedbacks.length) return 0;

    const total =
      this.feedbacks.reduce(
        (acc, f) =>
          acc + f.didactics + f.subjectMastery + f.punctuality + f.communication + f.engagement,
        0,
      ) /
      (2.5 * this.feedbacks.length);

    return total.toFixed(1);
  }

  returnBack() {
    this.location.back();
  }

  limitValue(event: any, controlName: string) {
    let value = Number(event.target.value);

    if (value > 5) {
      value = 5;
    }

    if (value < 0) {
      value = 0;
    }

    this.reviewForm.get(controlName)?.setValue(value, { emitEvent: false });
  }
}

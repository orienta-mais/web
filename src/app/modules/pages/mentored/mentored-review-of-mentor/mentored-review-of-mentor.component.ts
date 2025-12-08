import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { take } from 'rxjs';
import { Location } from '@angular/common';
import { MentoredService } from '../../../../@core/services/mentored/mentored.service';
import { noWhitespaceValidator } from '../../../../@core/validators';

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
  canAddReview = false;

  reviewForm!: FormGroup;

  ratingFields = ['didactics', 'subjectMastery', 'punctuality', 'communication', 'engagement'];

  constructor(
    private route: ActivatedRoute,
    private mentoredService: MentoredService,
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
      didactics: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      subjectMastery: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      punctuality: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      communication: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      engagement: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      feedback: [
        '',
        [
          Validators.required,
          noWhitespaceValidator,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
    });
  }

  loadMentorData() {
    this.mentoredService
      .getMentorDetails(this.mentorId)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.mentor = data;
          this.feedbacks = data.reviews || [];
          this.canAddReview = data.canAddReview || false;
        },
        error: () => {
          this.toast.error('Erro ao carregar dados do mentor.');
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
    };

    this.mentoredService
      .sendFeedback(this.mentorId, payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.toast.success('Feedback enviado com sucesso!');
          this.feedbacks.push(payload);
          this.showReviewForm = false;
          this.reviewForm.reset();
          this.loadMentorData();
        },
        error: () => {
          this.toast.error('Erro ao enviar feedback.');
        },
      });
  }

  getAverage() {
    if (!this.feedbacks.length) return 0;

    const total = this.feedbacks.reduce(
      (acc, f) =>
        acc + f.didactics + f.subjectMastery + f.punctuality + f.communication + f.engagement,
      0,
    );

    const maxPerFeedback = 25;
    const maxScale = 5;

    const average = (total / (this.feedbacks.length * maxPerFeedback)) * maxScale;

    return Number(average.toFixed(1));
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

  get anyRatingInvalid() {
    return this.ratingFields.some((f) => {
      const ctrl = this.reviewForm.get(f);
      return ctrl?.touched && ctrl.invalid;
    });
  }

  get ratingMinError() {
    return this.ratingFields.some((f) => this.reviewForm.get(f)?.errors?.['min']);
  }

  get ratingMaxError() {
    return this.ratingFields.some((f) => this.reviewForm.get(f)?.errors?.['max']);
  }

  get feedback() {
    return this.reviewForm.get('feedback');
  }
}

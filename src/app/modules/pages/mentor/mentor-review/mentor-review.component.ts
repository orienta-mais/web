import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MentorService } from '../../../../@core/services/mentor/mentor.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { MentorFeedback } from '../../../../@core/interfaces/mentor.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mentor-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mentor-review.component.html',
  styleUrls: ['./mentor-review.component.css'],
})
export class MentorReviewComponent implements OnInit {
  mentorId!: string;
  mentor: any = null;
  feedbacks: MentorFeedback[] = [];

  constructor(
    private mentorService: MentorService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadMentorInfo();
  }

  loadMentorInfo() {
    this.mentorService.getFeedbacks(this.mentorId).subscribe({
      next: (data) => {
        this.feedbacks = data;
      },
      error: () => {
        this.toast.error('Erro ao carregar informações. Usando mock.');
        this.feedbacks = [
          {
            id: 'a1',
            mentoredId: 'm1',
            didactics: 5,
            subjectMastery: 4,
            punctuality: 5,
            communication: 4,
            engagement: 5,
            feedback: 'Excelente mentor! Explicações claras e objetivas.',
          },
          {
            id: 'a2',
            mentoredId: 'm2',
            didactics: 4,
            subjectMastery: 5,
            punctuality: 4,
            communication: 5,
            engagement: 4,
            feedback: 'Muito bom! Ajudou bastante na minha evolução técnica.',
          },
        ];

        console.log(this.feedbacks);
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
}

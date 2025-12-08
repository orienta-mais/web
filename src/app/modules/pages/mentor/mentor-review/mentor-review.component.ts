import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MentorService } from '../../../../@core/services/mentor/mentor.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { MentorFeedback } from '../../../../@core/interfaces/mentor.interface';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../@core/services/user/user.service';

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
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.mentorId = this.userService.getId();
    this.loadMentorInfo();
  }

  loadMentorInfo() {
    this.mentorService.getFeedbacks(this.mentorId).subscribe({
      next: (data) => {
        this.feedbacks = data;
      },
      error: () => {
        this.toast.error('Erro ao carregar informações.');
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
}

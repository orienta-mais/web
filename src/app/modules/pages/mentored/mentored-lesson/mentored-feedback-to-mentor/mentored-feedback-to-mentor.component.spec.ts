import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentoredFeedbackToMentorComponent } from './mentored-feedback-to-mentor.component';

describe('MentoredFeedbackToMentorComponent', () => {
  let component: MentoredFeedbackToMentorComponent;
  let fixture: ComponentFixture<MentoredFeedbackToMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentoredFeedbackToMentorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MentoredFeedbackToMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

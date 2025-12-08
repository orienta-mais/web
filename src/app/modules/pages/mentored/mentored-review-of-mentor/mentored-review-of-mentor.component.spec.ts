import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentoredReviewOfMentorComponent } from './mentored-review-of-mentor.component';

describe('MentoredReviewOfMentorComponent', () => {
  let component: MentoredReviewOfMentorComponent;
  let fixture: ComponentFixture<MentoredReviewOfMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentoredReviewOfMentorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MentoredReviewOfMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

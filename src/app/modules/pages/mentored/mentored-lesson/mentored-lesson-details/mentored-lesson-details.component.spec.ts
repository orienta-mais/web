import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentoredLessonDetailsComponent } from './mentored-lesson-details.component';

describe('MentoredLessonDetailsComponent', () => {
  let component: MentoredLessonDetailsComponent;
  let fixture: ComponentFixture<MentoredLessonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentoredLessonDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MentoredLessonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

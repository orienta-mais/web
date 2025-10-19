import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentoredLessonComponent } from './mentored-lesson.component';

describe('MentoredLessonComponent', () => {
  let component: MentoredLessonComponent;
  let fixture: ComponentFixture<MentoredLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentoredLessonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MentoredLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

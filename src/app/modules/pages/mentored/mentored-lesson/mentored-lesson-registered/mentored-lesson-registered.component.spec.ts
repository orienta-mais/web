import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentoredLessonRegisteredComponent } from './mentored-lesson-registered.component';

describe('MentoredLessonRegisteredComponent', () => {
  let component: MentoredLessonRegisteredComponent;
  let fixture: ComponentFixture<MentoredLessonRegisteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentoredLessonRegisteredComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MentoredLessonRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorProfileDetailsComponent } from './mentor-profile-details.component';

describe('MentorProfileDetailsComponent', () => {
  let component: MentorProfileDetailsComponent;
  let fixture: ComponentFixture<MentorProfileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorProfileDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MentorProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

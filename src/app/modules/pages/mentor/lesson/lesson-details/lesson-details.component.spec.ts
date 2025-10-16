import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasonDetailsComponent } from './lesson-details.component';

describe('LeasonDetailsComponent', () => {
  let component: LeasonDetailsComponent;
  let fixture: ComponentFixture<LeasonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeasonDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeasonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

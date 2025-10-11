import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasonComponent } from './leason.component';

describe('LeasonComponent', () => {
  let component: LeasonComponent;
  let fixture: ComponentFixture<LeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeasonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

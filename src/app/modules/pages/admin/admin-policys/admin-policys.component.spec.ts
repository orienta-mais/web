import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPolicysComponent } from './admin-policys.component';

describe('AdminPolicysComponent', () => {
  let component: AdminPolicysComponent;
  let fixture: ComponentFixture<AdminPolicysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPolicysComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPolicysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

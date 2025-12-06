import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptOfTermsComponent } from './accept-of-terms.component';

describe('AcceptOfTermsComponent', () => {
  let component: AcceptOfTermsComponent;
  let fixture: ComponentFixture<AcceptOfTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptOfTermsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcceptOfTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendValidateEmailComponent } from './send-validate-email.component';

describe('SendValidateEmailComponent', () => {
  let component: SendValidateEmailComponent;
  let fixture: ComponentFixture<SendValidateEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendValidateEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendValidateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

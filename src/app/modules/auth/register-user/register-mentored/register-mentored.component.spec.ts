import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMentoredComponent } from './register-mentored.component';

describe('RegisterMentoredComponent', () => {
  let component: RegisterMentoredComponent;
  let fixture: ComponentFixture<RegisterMentoredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterMentoredComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterMentoredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

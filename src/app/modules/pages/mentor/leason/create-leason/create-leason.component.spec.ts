import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeasonComponent } from './create-leason.component';

describe('CreateLeasonComponent', () => {
  let component: CreateLeasonComponent;
  let fixture: ComponentFixture<CreateLeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLeasonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateLeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

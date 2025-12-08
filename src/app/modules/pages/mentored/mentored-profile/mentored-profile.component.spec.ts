import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentoredProfileComponent } from './mentored-profile.component';

describe('MentoredProfileComponent', () => {
  let component: MentoredProfileComponent;
  let fixture: ComponentFixture<MentoredProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentoredProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MentoredProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

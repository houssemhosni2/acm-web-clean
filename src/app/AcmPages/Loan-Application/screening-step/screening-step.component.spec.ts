import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScreeningStepComponent } from './screening-step.component';

describe('ScreeningStepComponent', () => {
  let component: ScreeningStepComponent;
  let fixture: ComponentFixture<ScreeningStepComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreeningStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreeningStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

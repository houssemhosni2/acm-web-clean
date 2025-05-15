import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuarantorsStepComponent } from './guarantors-step.component';

describe('GuarantorsStepComponent', () => {
  let component: GuarantorsStepComponent;
  let fixture: ComponentFixture<GuarantorsStepComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuarantorsStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarantorsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

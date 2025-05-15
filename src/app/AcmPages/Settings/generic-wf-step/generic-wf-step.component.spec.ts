import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericWfStepComponent } from './generic-wf-step.component';

describe('GenericWfStepComponent', () => {
  let component: GenericWfStepComponent;
  let fixture: ComponentFixture<GenericWfStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericWfStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericWfStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

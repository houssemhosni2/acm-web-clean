import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdfStepWorkflowComponent } from './udf-step-workflow.component';

describe('UdfStepWorkflowComponent', () => {
  let component: UdfStepWorkflowComponent;
  let fixture: ComponentFixture<UdfStepWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UdfStepWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UdfStepWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

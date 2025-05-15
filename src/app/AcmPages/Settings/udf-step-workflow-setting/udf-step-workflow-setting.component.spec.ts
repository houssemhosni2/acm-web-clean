import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdfStepWorkflowSettingComponent } from './udf-step-workflow-setting.component';

describe('UdfStepWorkflowSettingComponent', () => {
  let component: UdfStepWorkflowSettingComponent;
  let fixture: ComponentFixture<UdfStepWorkflowSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UdfStepWorkflowSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UdfStepWorkflowSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

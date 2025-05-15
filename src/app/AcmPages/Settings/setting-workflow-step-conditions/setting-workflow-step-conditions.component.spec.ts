import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingWorkflowStepConditionsComponent } from './setting-workflow-step-conditions.component';

describe('SettingWorkflowStepConditionsComponent', () => {
  let component: SettingWorkflowStepConditionsComponent;
  let fixture: ComponentFixture<SettingWorkflowStepConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingWorkflowStepConditionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingWorkflowStepConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericWfSettingWorkflowComponent } from './generic-wf-setting-workflow.component';

describe('GenericWfSettingWorkflowComponent', () => {
  let component: GenericWfSettingWorkflowComponent;
  let fixture: ComponentFixture<GenericWfSettingWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericWfSettingWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericWfSettingWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

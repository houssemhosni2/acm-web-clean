import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlWorkflowDetailsComponent } from './aml-workflow-details.component';

describe('AmlWorkflowDetailsComponent', () => {
  let component: AmlWorkflowDetailsComponent;
  let fixture: ComponentFixture<AmlWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmlWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

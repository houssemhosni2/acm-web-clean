import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ApprovalFieldVisitComponent} from './approval-field-visit.component';

describe('ApprovalFieldVisitComponent', () => {
  let component: ApprovalFieldVisitComponent;
  let fixture: ComponentFixture<ApprovalFieldVisitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalFieldVisitComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalFieldVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

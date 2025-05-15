import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationApprovalComponent } from './validation-approval.component';

describe('ValidationApprovalComponent', () => {
  let component: ValidationApprovalComponent;
  let fixture: ComponentFixture<ValidationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

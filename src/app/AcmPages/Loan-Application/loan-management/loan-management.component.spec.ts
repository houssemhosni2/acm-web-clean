import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanManagementComponent } from './loan-management.component';

describe('LoanManagementComponent', () => {
  let component: LoanManagementComponent;
  let fixture: ComponentFixture<LoanManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

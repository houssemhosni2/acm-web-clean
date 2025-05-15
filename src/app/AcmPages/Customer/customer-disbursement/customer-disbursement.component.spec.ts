import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerDisbursementComponent } from './customer-disbursement.component';

describe('CustomerDisbursementComponent', () => {
  let component: CustomerDisbursementComponent;
  let fixture: ComponentFixture<CustomerDisbursementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDisbursementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

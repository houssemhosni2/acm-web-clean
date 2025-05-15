import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IssuanceRepaymentIncentivesComponent } from './issuance-repayment-incentives.component';

describe('IssuanceRepaymentIncentivesComponent', () => {
  let component: IssuanceRepaymentIncentivesComponent;
  let fixture: ComponentFixture<IssuanceRepaymentIncentivesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuanceRepaymentIncentivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuanceRepaymentIncentivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

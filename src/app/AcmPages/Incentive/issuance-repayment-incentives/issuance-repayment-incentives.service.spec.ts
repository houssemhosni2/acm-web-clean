import { TestBed } from '@angular/core/testing';

import { IssuanceRepaymentIncentivesService } from './issuance-repayment-incentives.service';

describe('IssuanceRepaymentIncentivesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IssuanceRepaymentIncentivesService = TestBed.get(IssuanceRepaymentIncentivesService);
    expect(service).toBeTruthy();
  });
});

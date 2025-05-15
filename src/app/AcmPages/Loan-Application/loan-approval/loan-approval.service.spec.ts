import {TestBed} from '@angular/core/testing';

import {LoanApprovalService} from './loan-approval.service';

describe('LoanApprovalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoanApprovalService = TestBed.get(LoanApprovalService);
    expect(service).toBeTruthy();
  });
});

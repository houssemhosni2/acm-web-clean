import { TestBed } from '@angular/core/testing';

import { LoanManagementService } from './loan-management.service';

describe('LoanManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoanManagementService = TestBed.get(LoanManagementService);
    expect(service).toBeTruthy();
  });
});

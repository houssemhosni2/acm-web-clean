import { TestBed } from '@angular/core/testing';

import { IncentiveService } from './incentive.service';

describe('IncentiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncentiveService = TestBed.get(IncentiveService);
    expect(service).toBeTruthy();
  });
});

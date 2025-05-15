import { TestBed } from '@angular/core/testing';

import { RunIncentiveService } from './run-incentive.service';

describe('RunIncentiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RunIncentiveService = TestBed.get(RunIncentiveService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { OperationIncentivesService } from './operation-incentives.service';

describe('OperationIncentivesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OperationIncentivesService = TestBed.get(OperationIncentivesService);
    expect(service).toBeTruthy();
  });
});

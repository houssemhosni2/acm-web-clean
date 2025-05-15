import { TestBed } from '@angular/core/testing';

import { RegistrationIncentivesService } from './registration-incentives.service';

describe('RegistrationIncentivesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistrationIncentivesService = TestBed.get(RegistrationIncentivesService);
    expect(service).toBeTruthy();
  });
});

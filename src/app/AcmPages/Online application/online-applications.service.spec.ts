import { TestBed } from '@angular/core/testing';

import { OnlineApplicationsService } from './online-applications.service';

describe('LoanAssignService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnlineApplicationsService = TestBed.get(OnlineApplicationsService);
    expect(service).toBeTruthy();
  });
});

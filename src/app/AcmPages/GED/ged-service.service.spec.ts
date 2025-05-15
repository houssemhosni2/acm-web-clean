import {TestBed} from '@angular/core/testing';

import {GedServiceService} from './ged-service.service';

describe('GedServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GedServiceService = TestBed.get(GedServiceService);
    expect(service).toBeTruthy();
  });
});

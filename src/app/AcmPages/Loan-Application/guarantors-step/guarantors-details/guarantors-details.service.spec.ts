import { TestBed } from '@angular/core/testing';

import { GuarantorsDetailsService } from './guarantors-details.service';

describe('GuarantorsDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuarantorsDetailsService = TestBed.get(GuarantorsDetailsService);
    expect(service).toBeTruthy();
  });
});

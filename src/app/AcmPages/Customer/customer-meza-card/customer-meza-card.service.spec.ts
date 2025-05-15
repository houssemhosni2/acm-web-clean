import { TestBed } from '@angular/core/testing';

import { CustomerMezaCardService } from './customer-meza-card.service';

describe('CustomerMezaCardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerMezaCardService = TestBed.get(CustomerMezaCardService);
    expect(service).toBeTruthy();
  });
});

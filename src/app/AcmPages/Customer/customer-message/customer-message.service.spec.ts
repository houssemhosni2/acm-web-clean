import { TestBed } from '@angular/core/testing';

import { CustomerMessageService } from './customer-message.service';

describe('CustomerMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerMessageService = TestBed.get(CustomerMessageService);
    expect(service).toBeTruthy();
  });
});

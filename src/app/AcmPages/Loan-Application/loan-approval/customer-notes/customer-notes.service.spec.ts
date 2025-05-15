import {TestBed} from '@angular/core/testing';

import {CustomerNotesService} from './customer-notes.service';

describe('CustomerNotesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerNotesService = TestBed.get(CustomerNotesService);
    expect(service).toBeTruthy();
  });
});

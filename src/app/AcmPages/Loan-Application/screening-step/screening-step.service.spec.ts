import { TestBed } from '@angular/core/testing';

import { ScreeningStepService } from './screening-step.service';

describe('ScreeningStepService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScreeningStepService = TestBed.get(ScreeningStepService);
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeFeeStepComponent } from './charge-fee-step.component';

describe('ChargeFeeStepComponent', () => {
  let component: ChargeFeeStepComponent;
  let fixture: ComponentFixture<ChargeFeeStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeFeeStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeFeeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

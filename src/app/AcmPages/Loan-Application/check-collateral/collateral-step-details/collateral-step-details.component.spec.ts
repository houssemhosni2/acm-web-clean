import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralStepDetailsComponent } from './collateral-step-details.component';

describe('CollateralStepDetailsComponent', () => {
  let component: CollateralStepDetailsComponent;
  let fixture: ComponentFixture<CollateralStepDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollateralStepDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralStepDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

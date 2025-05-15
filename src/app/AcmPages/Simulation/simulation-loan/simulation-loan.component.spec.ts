import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationLoanComponent } from './simulation-loan.component';

describe('SimulationLoanComponent', () => {
  let component: SimulationLoanComponent;
  let fixture: ComponentFixture<SimulationLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

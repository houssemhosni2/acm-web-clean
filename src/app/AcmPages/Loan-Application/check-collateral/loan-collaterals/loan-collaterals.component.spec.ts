import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LoanCollateralsComponent} from './loan-collaterals.component';

describe('LoanCollateralsComponent', () => {
  let component: LoanCollateralsComponent;
  let fixture: ComponentFixture<LoanCollateralsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoanCollateralsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanCollateralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

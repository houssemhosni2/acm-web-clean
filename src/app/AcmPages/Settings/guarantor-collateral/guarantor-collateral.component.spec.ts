import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuarantorCollateralComponent } from './guarantor-collateral.component';

describe('GuarantarCollateralComponent', () => {
  let component: GuarantorCollateralComponent;
  let fixture: ComponentFixture<GuarantorCollateralComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GuarantorCollateralComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarantorCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

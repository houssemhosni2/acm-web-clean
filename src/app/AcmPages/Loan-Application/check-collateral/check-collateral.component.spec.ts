import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {CheckCollateralComponent} from './check-collateral.component';

describe('CheckCollateralComponent', () => {
  let component: CheckCollateralComponent;
  let fixture: ComponentFixture<CheckCollateralComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CheckCollateralComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

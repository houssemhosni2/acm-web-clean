import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {CustomerAccount360Component} from './customer-account-360.component';

describe('CustomerAccountComponent', () => {
  let component: CustomerAccount360Component;
  let fixture: ComponentFixture<CustomerAccount360Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerAccount360Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAccount360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

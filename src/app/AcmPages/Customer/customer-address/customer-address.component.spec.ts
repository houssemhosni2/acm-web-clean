import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerAddressComponent } from './customer-address.component';

describe('CustomerAddressComponent', () => {
  let component: CustomerAddressComponent;
  let fixture: ComponentFixture<CustomerAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

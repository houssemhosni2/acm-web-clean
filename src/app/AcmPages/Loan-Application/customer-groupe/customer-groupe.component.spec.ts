import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerGroupeComponent } from './customer-groupe.component';

describe('CustomerGroupeComponent', () => {
  let component: CustomerGroupeComponent;
  let fixture: ComponentFixture<CustomerGroupeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerGroupeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
